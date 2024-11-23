'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ProfileData {
  firstName?: string;
  lastName?: string;
  headline?: string;
  location?: string;
  summary?: string;
  roast?: string;
  profilePicture?: string;

}

export default function CreatePage() {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [cardId, setCardId] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleExtractProfile = async () => {
    if (!linkedInUrl.includes('linkedin.com/')) {
      setError('Please enter a valid LinkedIn URL');
      return;
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
      console.log('Profile data:', data);
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
    
    setIsCreatingCard(true);
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      
      const data = await response.json();
      if (data.success) {
        router.push(`/card/${data.cardId}`);
      }
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setIsCreatingCard(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-800 px-4 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-white drop-shadow-lg px-2">
          🎄 Holiday LinkedIn Roaster 🎅
        </h1>

        <Card className="bg-white/90 backdrop-blur-sm border-2 border-red-200 shadow-xl mx-2">
          <div className="space-y-4 sm:space-y-6">
            <Input
              label="Who's Getting Roasted? 🎯"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="linkedin.com/in/username"
              helperText="Drop their LinkedIn URL for some holiday fun!"
              error={error || undefined}
              className="border-green-500 focus:ring-red-500 text-sm sm:text-base"
            />

            <Button
              onClick={handleExtractProfile}
              fullWidth
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transform transition hover:scale-105 text-sm sm:text-base"
              isLoading={isLoadingProfile}
            >
              {isLoadingProfile ? '🎁 Wrapping...' : '🔥 Roast This Profile'}
            </Button>
          </div>
        </Card>

        {/* Mobile-Friendly Dialog */}
        {showProfileDialog && profileData && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
            onClick={() => setShowProfileDialog(false)}
          >
            <div 
              className="bg-white/95 backdrop-blur rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-2xl border-2 border-red-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center sticky top-0 bg-white/95 pb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-red-600">🎄 Holiday Roast! 🎅</h2>
                <button 
                  onClick={() => setShowProfileDialog(false)}
                  className="text-gray-500 hover:text-red-600 transition-colors p-2"
                >
                  ❌
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {profileData.firstName && profileData.lastName && (
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                    <label className="text-xs sm:text-sm font-medium text-red-700">Target Acquired:</label>
                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                      🎯 {profileData.firstName} {profileData.lastName}
                    </p>
                  </div>
                )}

                {profileData.profilePicture && (
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                    <label className="text-xs sm:text-sm font-medium text-green-700">Evidence:</label>
                    <div className="mt-2 flex justify-center">
                      <img 
                        src={profileData.profilePicture} 
                        alt="Profile" 
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg ring-4 ring-red-500 ring-offset-2 object-cover"
                      />
                    </div>
                  </div>
                )}

                {profileData.roast && (
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                    <label className="text-xs sm:text-sm font-medium text-red-700">🎄 The Holiday Roast 🔥</label>
                    <p className="text-gray-900 text-base sm:text-lg font-medium mt-2 whitespace-pre-line leading-relaxed">
                      {profileData.roast}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 sm:pt-4 sticky bottom-0 bg-white/95 space-y-2">
                {!cardId ? (
                  <Button
                    onClick={handleCreateCard}
                    fullWidth
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transform transition hover:scale-105 text-sm sm:text-base"
                    isLoading={isCreatingCard}
                  >
                    {isCreatingCard ? '🎁 Creating...' : '🎄 Create Shareable Card 🎅'}
                  </Button>
                ) : (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="font-bold text-green-700">Card Created! ID: {cardId}</p>
                  </div>
                )}
                
                <Button
                  onClick={() => setShowProfileDialog(false)}
                  fullWidth
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transform transition hover:scale-105 text-sm sm:text-base"
                >
                  🎄 More Roasting! 🎅
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
