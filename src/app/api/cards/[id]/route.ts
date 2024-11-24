import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mogodb';
import { Victim } from '@/lib/models/Card';

// Define the correct params interface
interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    await connectToDatabase();
    const cardId = parseInt(context.params.id);
    
    const victim = await Victim.findOne({ cardId });
    
    if (!victim) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: victim });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch card' },
      { status: 500 }
    );
  }
}
