import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? '';

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Query all accepted friendships where this user is a participant
    const friendshipsQuery = query(
      collection(db, 'friendships'),
      where('userIds', 'array-contains', userId),
      where('status', '==', 'accepted')
    );

    const snap = await getDocs(friendshipsQuery);

    const friends = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data();
        const userIds: string[] = data.userIds ?? [];
        const friendId = userIds.find((id) => id !== userId) ?? '';

        if (!friendId) return null;

        try {
          const friendSnap = await getDoc(doc(db, 'users', friendId));
          if (!friendSnap.exists()) return null;
          const friendData = friendSnap.data();
          return {
            friendshipId: d.id,
            friendId,
            displayName: friendData.displayName as string ?? 'EcoHero',
            avatar: friendData.avatar as string ?? '🌱',
            level: friendData.level as number ?? 1,
            totalPoints: friendData.totalPoints as number ?? 0,
            currentStreak: friendData.currentStreak as number ?? 0,
          };
        } catch {
          return null;
        }
      })
    );

    return NextResponse.json({
      friends: friends.filter((f) => f !== null),
    });
  } catch (error) {
    console.error('Friends list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
