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
      
      {/* Made by Sid credit */}
      <a
        href="https://www.linkedin.com/in/siddhartha-upase-a6963617a/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-2 left-2 sm:top-4 sm:left-4 text-[#FFD700] text-sm sm:text-base 
          hover:text-white transition-colors duration-300 z-30 flex items-center gap-1"
      >
        Made by Sid <span className="text-red-200 animate-pulse">♥</span>
      </a>

      {/* Existing Create Card button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push('/create');
        }}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#FFD700] text-[#B22222] 
          px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base
          font-semibold hover:bg-[#FFE55C] transition-colors duration-300 z-30"
      >
        Create a Card
      </button>

      <audio
        ref={audioRef}
        src="/music/christmas-music.mp3"
        loop
        preload="auto"
      />
      
      <div className="card-container w-full max-w-[90vw] sm:max-w-lg">
        <div 
          className={`card ${isOpen ? 'open' : ''}`} 
          onClick={handleCardClick}
        >
          {/* Front of Card - Made more responsive */}
          <div className="card-front bg-[#B22222] backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-8 border-4 border-[#FFD700]">
            <div className="flex flex-col items-center justify-center h-full space-y-4 sm:space-y-8 bg-[#B22222]/95 rounded-xl relative">
              {/* Adjusted star positions for mobile */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                <span className="text-[#FFD700] text-2xl sm:text-4xl">★</span>
              </div>
              <div className="absolute top-1 right-4 sm:top-2 sm:right-8">
                <span className="text-[#FFD700] text-xl sm:text-3xl">★</span>
              </div>
              <div className="absolute bottom-3 right-2 sm:bottom-6 sm:right-4">
                <span className="text-[#FFD700] text-2xl sm:text-4xl">★</span>
              </div>

              <img 
                src={cardData?.profilePicture} 
                alt="Profile" 
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full ring-4 ring-[#FFD700] ring-offset-2 ring-offset-[#B22222] object-cover"
              />
              <div className="space-y-2 sm:space-y-4 text-center">
                <h2 className="text-2xl sm:text-3xl christmas-heading text-[#FFD700]">
                  Dear {cardData?.firstName}
                </h2>
                <h1 className="text-3xl sm:text-4xl christmas-heading text-white tracking-wider">
                  Special Message for You
                </h1>
                
                <p className="text-sm sm:text-base text-white mt-2 sm:mt-4 tracking-wide regular-text animate-bounce">
                  Click to open your special message! ✨
                </p>
              </div>
            </div>
          </div>

          {/* Back of Card - Made more responsive */}
          <div className="card-back bg-[#B22222] backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-8 border-4 border-[#FFD700]">
            {cardData && (
              <div className="flex flex-col items-center justify-center h-full space-y-3 sm:space-y-6 bg-[#B22222]/95 rounded-xl relative">
                {/* Adjusted star positions for mobile */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                  <span className="text-[#FFD700] text-2xl sm:text-4xl">★</span>
                </div>
                <div className="absolute bottom-3 right-2 sm:bottom-6 sm:right-4">
                  <span className="text-[#FFD700] text-2xl sm:text-4xl">★</span>
                </div>

                <img 
                  src={cardData.profilePicture} 
                  alt="Profile" 
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full ring-4 ring-[#FFD700] ring-offset-2 ring-offset-[#B22222] object-cover"
                />
                <div className="space-y-2 sm:space-y-4 text-center max-w-md">
                  <h2 className="text-2xl sm:text-3xl christmas-heading text-[#FFD700]">
                    Dear {cardData.firstName}
                  </h2>
                  <p className="wish-text text-base sm:text-3xl px-2 sm:px-0">
                    {cardData.wish && cardData.wish.length > 0 ? cardData.wish : "Your friend just made a Christmas wish for you! 🎄"}
                  </p>
                  {/* <div className="pt-2 sm:pt-4 pb-2 text-[#FFD700] text-sm sm:text-4xl christmas-heading">
                    ✨ Happy Holidays! ✨
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}