import React, { useState } from 'react';
import Button from '../ui/Button';

interface CardShareProps {
  cardId: string;
  customUrl?: string;
}

const CardShare: React.FC<CardShareProps> = ({ cardId, customUrl }) => {
  const [copied, setCopied] = useState(false);
  
  const cardUrl = customUrl 
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/${customUrl}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/preview/${cardId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Christmas Wish Card',
          text: 'Check out my Christmas wish card!',
          url: cardUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={cardUrl}
          readOnly
          className="flex-1 p-2 border rounded-lg"
        />
        <Button onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
      </div>
      
     
        <Button onClick={handleShare} variant="secondary" className="w-full">
          Share Card
        </Button>
   

      <div className="flex gap-2 justify-center">
        <Button
          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(cardUrl)}`, '_blank')}
          className="bg-blue-400"
        >
          Twitter
        </Button>
        <Button
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cardUrl)}`, '_blank')}
          className="bg-blue-600"
        >
          Facebook
        </Button>
      </div>
    </div>
  );
};

export default CardShare;
