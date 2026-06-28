import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase/config';

const rateSchema = z.object({
  messageId: z.string().min(1),
  rating: z.enum(['up', 'down']),
  userId: z.string().min(1),
});

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = rateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { messageId, rating } = parsed.data;

    await updateDoc(doc(db, 'chatMessages', messageId), { rating });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chat rate API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
