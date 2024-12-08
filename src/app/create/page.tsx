'use client';

import { useState, useEffect } from 'react';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ProfileData {
  firstName?: string;
  lastName?: string;
  headline?: string;
  location?: string;
  summary?: string;
  wish?: string;
  profilePicture?: string;
}

export default function CreatePage() {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [cardId] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [hasFreeTrial, setHasFreeTrial] = useState(true);
  const [remainingCards, setRemainingCards] = useState<number | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('success')) {
      localStorage.setItem('hasPaidForCards', 'true');
      localStorage.setItem('christmasCardCount', '0');
      setHasFreeTrial(true);
      setRemainingCards(10);
      window.history.replaceState({}, '', '/create');
    }

    const cardCount = localStorage.getItem('christmasCardCount');
    const hasPaid = localStorage.getItem('hasPaidForCards');
    
    if (hasPaid) {
      const usedCards = parseInt(cardCount || '0');
      setRemainingCards(10 - usedCards);
      setHasFreeTrial(usedCards < 10);
    } else {
      setHasFreeTrial(!cardCount || parseInt(cardCount) < 1);
      setRemainingCards(null);
    }
  }, []);

  const handleExtractProfile = async () => {
    if (!linkedInUrl.includes('linkedin.com/')) {
      setError('Please enter a valid LinkedIn URL');
      return;
    }

    const cardCount = parseInt(localStorage.getItem('christmasCardCount') || '0');
    const hasPaid = localStorage.getItem('hasPaidForCards');
    
    if (hasPaid) {
      if (cardCount >= 10) {
        setShowPaymentDialog(true);
        return;
      }
    } else {
      if (cardCount >= 1) {
        setShowPaymentDialog(true);
        return;
      }
    }

    setError(null);
    setIsLoadingProfile(true);
    
    try {
      const response = await fetch('/api/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedInUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfileData(data);
      setShowProfileDialog(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch LinkedIn profile. Please try again.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleCreateCard = async () => {
    if (!profileData) return;
    
    if (!hasFreeTrial) {
      setShowPaymentDialog(true);
      return;
    }
    
    setIsCreatingCard(true);
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      
      const data = await response.json();
      if (data.success) {
        const currentCount = localStorage.getItem('christmasCardCount');
        const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
        localStorage.setItem('christmasCardCount', newCount.toString());
        
        if (localStorage.getItem('hasPaidForCards')) {
          setRemainingCards(10 - newCount);
        }
        
        router.push(`/card/${data.cardId}`);
      }
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setIsCreatingCard(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { sessionId, error } = await response.json();
      if (error) throw new Error(error);

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('christmasCardCount');
    localStorage.removeItem('hasPaidForCards');
    setHasFreeTrial(true);
    setRemainingCards(null);
  };

  return (
    <div className="min-h-screen bg-[#DC143C] px-4 py-6 sm:py-8 relative overflow-hidden">

      {/* <button
        onClick={handleReset}
        className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gray-800 text-white 
          px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm
          font-medium hover:bg-gray-700 transition-colors duration-300 z-30 opacity-50 hover:opacity-100"
      >
        🔄 Reset Test Data
      </button> */}

      <a
        href="https://www.linkedin.com/in/siddhartha-upase-a6963617a/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 text-[#FFD700] text-base sm:text-lg
          hover:text-white transition-colors duration-300  flex items-center gap-2
          bg-[#B22222]/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-[#FFD700]
          shadow-lg hover:scale-105 transform transition-all"
      >
        <span className="font-semibold">Made by Sid</span>
        <span className="text-red-200 animate-pulse text-xl">♥</span>
      </a>

      <div className="max-w-2xl mx-auto relative z-10 pt-16">
        <h1 className="text-center mb-12">
          <div className="text-5xl sm:text-6xl christmas-heading text-white mb-2">
            Merry Christmas
          </div>
          <div className="text-2xl sm:text-3xl christmas-heading text-[#FFD700]">
            & Happy New Year
          </div>
          {remainingCards !== null && (
            <div className="mt-4 text-base sm:text-lg text-white regular-text bg-[#B22222]/80 
              inline-block px-4 py-1 rounded-full border border-[#FFD700]">
              {remainingCards} cards remaining ✨
            </div>
          )}
        </h1>

        <Card className="bg-white/95 backdrop-blur-sm shadow-xl mx-2 rounded-xl">
          <div className="space-y-6 p-6 regular-text">
            <Input
              label="Share Holiday Joy With..."
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="linkedin.com/in/username"
              helperText="Enter their LinkedIn URL for a personalized holiday wish"
              error={error || undefined}
              className="border-[#B22222] focus:ring-[#FFD700] regular-text text-gray-900"
            />

            <Button
              onClick={handleExtractProfile}
              fullWidth
              className="bg-[#B22222] hover:bg-[#8B0000] text-white font-medium py-3 px-4 rounded-lg transform transition hover:scale-105"
              isLoading={isLoadingProfile}
            >
              {isLoadingProfile ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-white">Creating Magic...</span>
                </div>
              ) : (
                '✨ Create Holiday Wish'
              )}
            </Button>
          </div>
        </Card>

        {/* Wish Preview Dialog */}
        {showProfileDialog && profileData && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowProfileDialog(false)}
          >
            <div 
              className="bg-white/95 backdrop-blur rounded-xl w-full max-w-md overflow-y-auto p-8 space-y-6 shadow-2xl regular-text"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-6">
                {profileData.profilePicture && (
                  <div className="flex justify-center">
                    <img 
                      src={profileData.profilePicture} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full ring-4 ring-[#B22222] ring-offset-2 object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#B22222]">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  {profileData.wish && (
                    <p className="text-lg font-medium text-gray-800 leading-relaxed">
                      {profileData.wish}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-6">
                  <Button
                    onClick={handleCreateCard}
                    fullWidth
                    className="bg-[#B22222] hover:bg-[#8B0000] text-white font-medium py-3 rounded-lg"
                    isLoading={isCreatingCard}
                  >
                    {isCreatingCard ? '🎁 Creating...' : 'Create Card 🧧'}
                  </Button>
                  
                  <Button
                    onClick={() => setShowProfileDialog(false)}
                    fullWidth
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg"
                  >
                    Create Another
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Dialog with updated button states */}
        {showPaymentDialog && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => !isProcessingPayment && setShowPaymentDialog(false)}
          >
            <div 
              className="bg-white/95 backdrop-blur rounded-xl w-full max-w-md mx-4 shadow-2xl regular-text"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">🎄</div>
                <h3 className="text-2xl font-bold text-[#B22222] christmas-heading">
                  Unlock Unlimited Christmas Joy!
                </h3>
                <div className="mt-4 space-y-4 text-gray-700">
                  <p className="text-lg">
                    Create 10 personalized LinkedIn-based Christmas cards for just
                    <span className="text-[#B22222] font-bold"> $5</span>!
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-left">
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> AI-powered personalization
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Professional LinkedIn integration
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Only $0.50 per card!
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="w-full bg-[#B22222] hover:bg-[#8B0000] text-white font-medium py-3 px-4 
                      rounded-lg transform transition hover:scale-105 disabled:opacity-50 
                      disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Get 10 Cards - Only $5'
                    )}
                  </button>
                  <button
                    onClick={() => setShowPaymentDialog(false)}
                    disabled={isProcessingPayment}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 
                      font-medium py-3 rounded-lg disabled:opacity-50"
                  >
                    Maybe Later
                  </button>
                </div>

                {error && (
                  <div className="mt-4 text-red-500 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
}


