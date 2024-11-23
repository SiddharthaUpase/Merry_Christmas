'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Snow from '@/app/components/Snow';

interface CardData {
  firstName: string;
  lastName: string;
  profilePicture: string;
  roast: string;
  cardId: number;
}

export default function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isOpen, setIsOpen] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/cards/${resolvedParams.id}`);
        const result = await response.json();
        
        if (result.success) {
          setCardData(result.data);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching card:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [resolvedParams.id, router]);

  const handleCardClick = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-800 to-green-900 flex items-center justify-center">
        <Snow />
        <div className="text-white text-2xl z-20">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-800 to-green-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Snow />
      
      <audio
        src="/music/christmas-music.mp3"
        autoPlay
        loop
        style={{ display: 'none' }}
      />
      
      <div className="card-container relative z-20">
        <div className={`card ${isOpen ? 'open' : ''}`} onClick={handleCardClick}>
          {/* Front of Card */}
          <div className="card-front">
            <div className="card-content">
              <img 
                src={cardData?.profilePicture} 
                alt="Profile" 
                className="w-24 h-24 rounded-full ring-4 ring-red-500 mb-4"
              />
              <h1 className="text-3xl font-bold text-red-600 mb-4">
                Hey {cardData?.firstName}!
              </h1>
              <p className="text-green-700">
                Your friend just made a Christmas roast for you! 🎄
              </p>
            </div>
          </div>

          {/* Back of Card */}
          <div className="card-back">
            {cardData && (
              <div className="card-content">
                <img 
                  src={cardData.profilePicture} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full ring-4 ring-red-500 mb-4"
                />
                <h2 className="text-xl font-bold text-red-600 mb-2">
                  {cardData.firstName} {cardData.lastName}
                </h2>
                <p className="text-lg text-green-700 mt-4">
                  {cardData.roast}
                </p>
                <div className="mt-6 text-red-500">
                  🎄 Ho Ho Ho! 🎅
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}