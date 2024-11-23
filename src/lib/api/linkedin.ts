const LINKEDIN_API_BASE = 'https://linkedin-data-api.p.rapidapi.com';
const RAPID_API_KEY = process.env.RAPID_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface LinkedInProfile {
  fullName?: string;
  headline?: string;
  location?: string;
  summary?: string;
}

async function generateRoast(profile: LinkedInProfile) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are creating short, witty holiday one-liners. Create a single line roast (max 100 characters) that plays on the person\'s job or location. Make it punny and festive!'
          },
          {
            role: 'user',
            content: `Create a short, punny holiday roast (max 100 chars) based on:
              Name: ${profile.fullName}
              Job: ${profile.headline}
              Location: ${profile.location}
              
              Example format: "Good things come to those who bake 🎄"
              Make it personal to their job/location!`
          }
        ],
        temperature: 0.9,
        max_tokens: 100,
        presence_penalty: 1.0 // Encourages more creative responses
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate roast');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating roast:', error);
    throw error;
  }
}

export async function fetchLinkedInProfile(linkedInUrl: string) {
  try {
    console.log('Fetching LinkedIn profile...');
    console.log('LinkedIn URL:', linkedInUrl);
    
    // Extract username from the LinkedIn URL
    const pathSegments = linkedInUrl.split('/');
    const username = pathSegments[pathSegments.length - 2] || '';

    const response = await fetch(`${LINKEDIN_API_BASE}/?username=${username}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY || '',
        'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch LinkedIn profile');
    }

    const profileData: LinkedInProfile = await response.json();
    
    // Generate roast using OpenAI
    console.log('Generating roast...');
    const roast = await generateRoast(profileData);

    // Return both profile data and roast
    return {
      ...profileData,
      roast
    };

  } catch (error) {
    console.error('Error in LinkedIn profile fetch or roast generation:', error);
    throw error;
  }
}
