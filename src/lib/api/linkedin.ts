import Anthropic from '@anthropic-ai/sdk';
import lennyData from '../../../public/lenny_data.json';

const LINKEDIN_API_BASE = 'https://linkedin-data-api.p.rapidapi.com';
const RAPID_API_KEY = process.env.RAPID_API_KEY;
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
  profilePicture?: string;
}

async function generateWish(profile: LinkedInProfile) {
  console.log('ANTHROPIC_API_KEY:', ANTHROPIC_API_KEY);
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
            - Start with their first name and make them feel special like "Dear ${profile.firstName}" or "Hey ${profile.firstName}"
            - Keep it to 50 words or less
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
    console.log('Fetching LinkedIn profile...');
    console.log('LinkedIn URL:', linkedInUrl);
    
    // Extract username from the LinkedIn URL
    const pathSegments = linkedInUrl.split('/');
    const username = pathSegments[pathSegments.length - 2] || '';
    console.log('Extracted username:', username);

    console.log(`Fetching profile data for ${username}...`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Profile data from Lenny:', lennyData);
    const profileData: LinkedInProfile = {
      firstName: lennyData.first_name,
      lastName: lennyData.last_name,
      headline: lennyData.headline,
      location: lennyData.location.full,
      summary: lennyData.summary,
      profilePicture: lennyData.picture
    };
    console.log('Constructed profile data:', profileData);
    
    // Generate wish instead of roast
    console.log('Starting wish generation...');
    const wish = await generateWish(profileData);

    const finalResult = {
      ...profileData,
      wish // changed from roast to wish
    };
    console.log('=== Completed LinkedIn Profile Fetch ===');
    return finalResult;

  } catch (error) {
    console.error('Error in LinkedIn profile fetch or wish generation:', error);
    throw error;
  }
}
