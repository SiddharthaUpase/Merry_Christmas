import { NextResponse } from 'next/server';
import { fetchLinkedInProfile } from '@/lib/api/linkedin';

export async function POST(request: Request) {
  console.log('=== Starting LinkedIn API Route Handler ===');
  try {
    console.log('=== Starting LinkedIn API Route Handler ===');
    
    const body = await request.json();
    console.log('Received request body:', body);
    
    const { linkedInUrl } = body;
    console.log('Extracted LinkedIn URL:', linkedInUrl);
    
    if (!linkedInUrl) {
      console.log('Error: LinkedIn URL is missing');
      return NextResponse.json(
        { error: 'LinkedIn URL is required' },
        { status: 400 }
      );
    }

    console.log('Calling fetchLinkedInProfile...');
    const profileData = await fetchLinkedInProfile(linkedInUrl);
    console.log('Profile data received:', profileData);
    
    console.log('=== Completed LinkedIn API Route Handler ===');
    return NextResponse.json(profileData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Detailed error in route handler:', {
        message: error.message,
        stack: error.stack,
        error
      });
    } else {
      console.error('Detailed error in route handler:', {
        message: 'An unknown error occurred',
        error
      });
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );

  }
}
}
