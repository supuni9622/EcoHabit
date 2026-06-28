import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';

const POINT_VALUES: Record<string, number> = {
  plastic: 10,
  paper: 8,
  'e-waste': 20,
  organic: 5,
  glass: 12,
  metal: 14,
  textile: 6,
  general: 5,
  other: 5,
};

const patchSchema = z.object({
  userId: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
  notes: z.string().max(200).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { logId: string } }
) {
  try {
    const { logId } = params;
    if (!logId) {
      return NextResponse.json({ error: 'Log ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { userId, quantity, notes } = parsed.data;

    // Fetch the log document
    const logRef = doc(db, 'habitLogs', logId);
    const logSnap = await getDoc(logRef);

    if (!logSnap.exists()) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    const logData = logSnap.data();

    // Verify ownership
    if (logData.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check within 24 hours
    const loggedAt: Date | null = logData.loggedAt instanceof Timestamp
      ? logData.loggedAt.toDate()
      : null;

    if (!loggedAt) {
      return NextResponse.json({ error: 'Invalid log timestamp' }, { status: 400 });
    }

    const hoursSinceLog = (Date.now() - loggedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLog > 24) {
      return NextResponse.json(
        { error: 'Logs can only be edited within 24 hours of logging' },
        { status: 400 }
      );
    }

    // Recalculate points
    const wasteType: string = logData.wasteType;
    const pointsPerUnit = POINT_VALUES[wasteType] ?? 5;
    const oldPoints: number = logData.pointsAwarded ?? 0;
    const newPoints = pointsPerUnit * quantity;
    const pointsDiff = newPoints - oldPoints;

    // Update the log document
    await updateDoc(logRef, {
      quantity,
      notes: notes ?? '',
      pointsAwarded: newPoints,
      updatedAt: serverTimestamp(),
    });

    // Adjust user's total points
    if (pointsDiff !== 0) {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentTotal: number = userSnap.data().totalPoints ?? 0;
        const adjustedTotal = Math.max(0, currentTotal + pointsDiff);
        await updateDoc(userRef, {
          totalPoints: adjustedTotal,
          updatedAt: serverTimestamp(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      logId,
      newPoints,
      pointsDiff,
    });
  } catch (error) {
    console.error('Edit log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
