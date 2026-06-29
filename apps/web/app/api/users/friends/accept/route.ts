import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase/config';

const acceptSchema = z.object({
  friendshipId: z.string().min(1),
  userId: z.string().min(1),
});

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = acceptSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { friendshipId, userId } = parsed.data;

    const friendshipRef = doc(db, 'friendships', friendshipId);
    const friendshipSnap = await getDoc(friendshipRef);

    if (!friendshipSnap.exists()) {
      return NextResponse.json({ error: 'Friendship not found' }, { status: 404 });
    }

    const data = friendshipSnap.data();
    const userIds: string[] = data.userIds ?? [];

    if (!userIds.includes(userId)) {
      return NextResponse.json(
        { error: 'Not authorized to accept this friendship' },
        { status: 403 }
      );
    }

    if (data.status === 'accepted') {
      return NextResponse.json({ success: true, message: 'Already accepted' });
    }

    await updateDoc(friendshipRef, {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Friend accept error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
