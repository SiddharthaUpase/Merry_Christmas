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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
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

  // Separate music toggle handler
  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicMuted(true);
      } else {
        audioRef.current.play().catch(error => {
          console.log("Playback failed:", error);
        });
        setIsMusicMuted(false);
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // Updated card click handler
  const handleCardClick = () => {
    if (!isOpen && !isMusicMuted && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Playback failed:", error);
      });
      setIsMusicPlaying(true);
    }
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
      onClick={handleCardClick}
    >
      <Snow />
      
      {/* Made by Sid credit - moved to middle left */}
      {/* <a
        href="https://www.linkedin.com/in/siddhartha-upase-a6963617a/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-14 left-2 sm:top-16 sm:left-4 text-[#FFD700] text-sm sm:text-base 
          hover:text-white transition-colors duration-300 z-30 flex items-center gap-1"
      >
        Made by Sid <span className="text-red-200 animate-pulse">♥</span>
      </a> */}

      {/* Music Toggle Button - moved to top left */}
      <button
        onClick={toggleMusic}
        className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#FFD700] text-[#B22222] 
          px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base
          font-semibold hover:bg-[#FFE55C] transition-colors duration-300 z-30"
      >
        {isMusicPlaying ? '🔇 Mute' : '🎵 Play'} Music
      </button>

      {/* Create Card button - kept at top right */}
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

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/music/feliz_navidad.mp3"
        loop
        preload="auto"
      />
      
      <div className="card-container w-full max-w-[90vw] sm:max-w-lg">
        <div 
          className={`card ${isOpen ? 'open' : ''}`} 
          onClick={handleCardClick}
        >
          {/* Front Cover - Updated with large profile picture */}
          <div className="card-front bg-[#B22222] backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-8 border-4 border-[#FFD700]">
            <div className="flex flex-col items-center justify-center h-full space-y-4 sm:space-y-6 bg-[#B22222]/95 rounded-xl relative">
              {/* Decorative stars */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                <span className="text-[#FFD700] text-3xl sm:text-5xl christmas-heading">✧</span>
              </div>
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
                <span className="text-[#FFD700] text-3xl sm:text-5xl christmas-heading">✧</span>
              </div>

              {/* Large Profile Picture */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <div className="rounded-full p-2 bg-[#FFD700] w-full h-full">
                  <img 
                    src={cardData?.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2">
                  <span className="text-2xl sm:text-3xl">🎄</span>
                </div>
              </div>

              {/* Intriguing message */}
              <div className="space-y-3 sm:space-y-4 text-center max-w-md">
                <h2 className="text-xl sm:text-3xl christmas-heading text-[#FFD700] mb-1 sm:mb-2">
                  Hey {cardData?.firstName}!
                </h2>
                <h1 className="text-2xl sm:text-4xl christmas-heading text-white tracking-wider leading-relaxed">
                  A Christmas Wish
                  <br />
                  For You
                </h1>
                
                <p className="text-sm sm:text-base text-[#FFD700] mt-4 tracking-wide regular-text animate-bounce">
                  Tap to unwrap your magical message! ✨
                </p>
              </div>
            </div>
          </div>

          {/* Back Cover - More compact layout */}
          <div className="card-back bg-[#B22222] backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border-4 border-[#FFD700]">
            {cardData && (
              <div className="flex flex-col h-full relative">
                {/* Decorative stars - more compact positioning */}
                <div className="absolute top-2 left-2">
                  <span className="text-[#FFD700] text-2xl sm:text-3xl christmas-heading">✧</span>
                </div>
                <div className="absolute bottom-2 right-2">
                  <span className="text-[#FFD700] text-2xl sm:text-3xl christmas-heading">✧</span>
                </div>

                {/* Main content container - reduced spacing */}
                <div className="flex flex-col items-center space-y-4 bg-[#B22222]/95 rounded-xl p-3 sm:p-4">
                  {/* Profile picture - smaller size */}
                  <div className="relative">
                    <div className="rounded-full p-1.5 bg-[#FFD700]">
                      <img 
                        src={cardData.profilePicture} 
                        alt="Profile" 
                        className="w-20 h-20 sm:w-25 sm:h-25 rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <span className="text-xl">🎄</span>
                    </div>
                  </div>

                  {/* Message content - reduced spacing */}
                  <div className="w-full space-y-3">
                    {/* Dear Name */}
                    <h2 className="text-lg sm:text-3xl christmas-heading text-[#FFD700] text-left">
                      Dear {cardData.firstName},
                    </h2>
                    
                    {/* Wish text - more compact container */}
                    <div className=" rounded-lg p-2">
                      <p className="wish-text text-white text-xl sm:text-3xl leading-relaxed">
                        {cardData.wish}
                      </p>
                    </div>

                    {/* Merry Christmas */}
                    {/* <div className="text-[#FFD700] text-lg sm:text-3xl christmas-heading text-center pt-2">
                      Merry Christmas! 🎄
                    </div> */}
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