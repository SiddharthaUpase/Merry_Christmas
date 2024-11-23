import { NextResponse } from 'next/server';
import { fetchLinkedInProfile } from '@/lib/api/linkedin';

export async function POST(request: Request) {
  try {
    console.log('Fetching LinkedIn profile...');
    const { linkedInUrl } = await request.json();

    if (!linkedInUrl) {
      return NextResponse.json(
        { error: 'LinkedIn URL is required' },
        { status: 400 }
      );
    }

    // Simulate API delay
    // await new Promise(resolve => setTimeout(resolve, 500));

    // // Read from local profile.json instead of making API call
    // const profileData = JSON.parse(
    //   fs.readFileSync(path.join(process.cwd(), 'profile.json'), 'utf-8')
    // );

    const profileData = await fetchLinkedInProfile(linkedInUrl);
    
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error reading profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LinkedIn profile' },
      { status: 500 }
    );
  }
}
