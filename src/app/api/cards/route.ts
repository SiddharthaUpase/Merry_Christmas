import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mogodb';
import { Victim } from '@/lib/models/Card';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    // Generate random 4 digit number and ensure it's unique
    let cardId;
    let isUnique = false;
    
    while (!isUnique) {
      cardId = Math.floor(1000 + Math.random() * 9000);
      const existingCard = await Victim.findOne({ cardId });
      if (!existingCard) {
        isUnique = true;
      }
    }

    // Create new victim record with both wish and roast fields
    const victim = await Victim.create({
      firstName: data.firstName,
      lastName: data.lastName,
      profilePicture: data.profilePicture,
      wish: data.wish,
      roast: data.wish, // Set roast to be the same as wish
      cardId
    });

    return NextResponse.json({
      success: true,
      cardId: victim.cardId,
      message: 'Victim successfully wished!'
    });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save victim to database' 
      },
      { status: 500 }
    );
  }
}
