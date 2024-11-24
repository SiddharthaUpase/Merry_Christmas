// src/app/api/cards/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mogodb';
import { Victim } from '@/lib/models/Card';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const cardId = parseInt(params.id);
    
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

// Optionally, add this to ensure Next.js generates the correct segments
export const dynamic = 'force-dynamic';