import Anthropic from '@anthropic-ai/sdk';
// import lennyData from '../../../public/lenny_data.json'; // Commented out for future use

const LINKEDIN_API_BASE = 'https://linkedin-api8.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;



// Initialize Anthropic client with explicit API key configuration
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  defaultHeaders: {
    'X-Api-Key': process.env.ANTHROPIC_API_KEY || ''
  }
});

// Add environment variable check
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set in environment variables');
}

interface LinkedInProfile {
  firstName?: string;
  lastName?: string;
  headline?: string;
  location?: string;
  summary?: string;
  education?: string;
  profilePicture?: string;
}

async function generateWish(profile: LinkedInProfile) {



  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 100,
      temperature: 0.9,
      messages: [
        {
          role: "user",
          content: `Create a cheerful, personalized holiday wish (max 100 chars) for:
            Name: ${profile.firstName} ${profile.lastName}
            Job: ${profile.headline}
            Location: ${profile.location}
            
            RESPONSE FORMAT:
            Return ONLY the wish text, without any introductions or explanations.
            Example response: "May your code be bug-free and your commits be merry! Merry Christmas! 🎄"
            
            Rules:
            -Do not start with "Dear" or "Hey" or their name as we are already using their name in the wish
            - Keep it to 50 words or less
            - Make it hyper personalized, it should be a wish for them, not a generic one
            -It should feel like a real person is writing it to them
            - Make it punny and festive
            - Include a playful reference to their job or location
            - Keep it warm and uplifting
            - Must end with "Merry Christmas! 🎄"
            - No introductions or explanations, just the wish`,

        }

      ],
      system: "You are a cheerful holiday wish creator. Return ONLY the wish text, without any introductions or explanations."
    });
    console.log('Response:', msg);
    // Extract just the wish text from the response
    const cleanWish = msg.content[0].type === 'text' ? msg.content[0].text : '';
    
    console.log('Generated wish:', cleanWish);
    return cleanWish;
  } catch (error) {
    console.error('Error generating wish:', error);
    throw error;
  }
}

export async function fetchLinkedInProfile(linkedInUrl: string) {
  try {
    console.log('=== Starting LinkedIn Profile Fetch ===');
    console.log('LinkedIn URL:', linkedInUrl);
    
    // Extract username from LinkedIn URL
    const username = linkedInUrl.split('/in/')[1]?.replace(/\/$/, '');
    if (!username) {
      throw new Error('Invalid LinkedIn URL format');
    }

    // RapidAPI call
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
      }
    };

    const response = await fetch(`${LINKEDIN_API_BASE}/?username=${username}`, options);
    const data = await response.json();
    
    console.log('API response:', data);

    // Map API response to our interface with only real data
    const profileData: LinkedInProfile = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      headline: data.headline || '',
      location: data.geo?.full || '',
      summary: data.summary || '',
      education: data.educations?.[0]?.schoolName || '',
      profilePicture: data.profilePicture || ''
    };

    // Validate required fields
    if (!profileData.firstName || !profileData.lastName) {
      throw new Error('Profile name not found');
    }

    console.log('Constructed profile data:', profileData);
    
    // Generate wish
    console.log('Starting wish generation...');
    const wish = await generateWish(profileData);

    const finalResult = {
      ...profileData,
      wish
    };
    console.log('=== Completed LinkedIn Profile Fetch ===');
    return finalResult;

  } catch (error) {
    console.error('Error in LinkedIn profile fetch or wish generation:', error);
    throw error;
  }
}
