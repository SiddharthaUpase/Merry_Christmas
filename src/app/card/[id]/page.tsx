'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Snow from '@/app/components/Snow';

interface CardData {
  firstName: string;
  lastName: string;
  profilePicture: string;
  wish: string;
  roast: string;
  cardId: number;
}

export default function CardPage({ params }: { params: { id: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/cards/${params.id}`);
        const result = await response.json();
        
        if (result.success) {
          //set the wish to the roast if it's empty
          const data = result.data;   
          if (!data.wish || data.wish.length === 0) {
            data.wish = data.roast;
          }
          setCardData(data);
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
  }, [params.id, router]);

  // Handle audio playback
  useEffect(() => {
    const playAudio = async () => {
      try {
        if (audioRef.current) {
          audioRef.current.volume = 0.3; // Lower volume
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.log("Autoplay prevented:", error);
              // Add a play button or handle the error as needed
            });
          }
        }
      } catch (error) {
        console.error("Audio playback error:", error);
      }
    };

    playAudio();
  }, []);

  // Add click handler to start audio
  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Playback failed:", error);
      });
    }
  };

  const handleCardClick = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#DC143C] flex items-center justify-center">
        <Snow />
        <div className="text-white text-2xl font-medium z-20">Creating your holiday magic...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#DC143C] flex items-center justify-center p-4 relative overflow-hidden"
      onClick={handleClick}
    >
      <Snow />
      
      <audio
        ref={audioRef}
        src="/music/christmas-music.mp3"
        loop
        preload="auto"
      />

      {/* Pine Needles Top */}
      {/* <div className="absolute top-0 left-0 right-0 h-32">
        <img 
          src="/images/pine-top.png" 
          alt="Pine needles" 
          className="w-full h-full object-cover"
        />
      </div> */}

      {/* Pine Needles Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 transform rotate-180">
        <img 
          src="/images/pine-top.png" 
          alt="Pine needles" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="card-container">
        <div 
          className={`card ${isOpen ? 'open' : ''}`} 
          onClick={handleCardClick}
        >
          {/* Front of Card */}
          <div className="card-front bg-[#B22222] backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-[#FFD700]">
            <div className="flex flex-col items-center justify-center h-full space-y-8 bg-[#B22222]/95 rounded-xl relative">
              {/* Gold Stars Decoration */}
              <div className="absolute top-4 left-4">
                <span className="text-[#FFD700] text-4xl">★</span>
              </div>
              <div className="absolute top-2 right-8">
                <span className="text-[#FFD700] text-3xl">★</span>
              </div>
              <div className="absolute bottom-6 right-4">
                <span className="text-[#FFD700] text-4xl">★</span>
              </div>

              <img 
                src={cardData?.profilePicture} 
                alt="Profile" 
                className="w-24 h-24 rounded-full ring-4 ring-[#FFD700] ring-offset-2 ring-offset-[#B22222] object-cover"
              />
              <div className="space-y-4 text-center">
                <h1 className="text-4xl font-bold text-white tracking-wider">
                  HAPPY HOLIDAYS
                </h1>
                <p className="text-2xl font-medium text-[#FFD700] italic" style={{ fontFamily: 'cursive' }}>
                  and
                </p>
                <p className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'cursive' }}>
                  Thank You
                </p>
                <p className="text-white mt-4 tracking-wide">
                  Click to open your special message! ✨
                </p>
              </div>
            </div>
          </div>

          {/* Back of Card */}
          <div className="card-back bg-[#B22222] backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-[#FFD700]">
            {cardData && (
              <div className="flex flex-col items-center justify-center h-full space-y-6 bg-[#B22222]/95 rounded-xl relative">
                {/* Gold Stars Decoration */}
                <div className="absolute top-4 left-4">
                  <span className="text-[#FFD700] text-4xl">★</span>
                </div>
                <div className="absolute bottom-6 right-4">
                  <span className="text-[#FFD700] text-4xl">★</span>
                </div>

                <img 
                  src={cardData.profilePicture} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full ring-4 ring-[#FFD700] ring-offset-2 ring-offset-[#B22222] object-cover"
                />
                <div className="space-y-4 text-center max-w-md">
                  <h2 className="text-2xl font-bold text-[#FFD700]" style={{ fontFamily: 'cursive' }}>
                    Dear {cardData.firstName}
                  </h2>
                  <p className="text-lg text-white font-medium leading-relaxed">
                    {cardData.wish && cardData.wish.length > 0 ? cardData.wish : "Your friend just made a Christmas wish for you! 🎄"}
                  </p>
                  <div className="pt-4 text-[#FFD700] text-xl">
                    ✨ Happy Holidays! ✨
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}