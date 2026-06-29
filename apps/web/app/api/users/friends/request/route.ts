import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase/config';

const requestSchema = z.object({
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { fromUserId, toUserId } = parsed.data;

    if (fromUserId === toUserId) {
      return NextResponse.json(
        { error: 'Cannot send friend request to yourself' },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'friendships'), {
      userIds: [fromUserId, toUserId],
      status: 'pending',
      requestedBy: fromUserId,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, friendshipId: docRef.id });
  } catch (error) {
    console.error('Friend request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
