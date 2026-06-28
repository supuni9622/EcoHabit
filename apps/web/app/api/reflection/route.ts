import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';

const reflectionSchema = z.object({
  userId: z.string().min(1),
  habitLogId: z.string().min(1),
  mood: z.number().int().min(1).max(5),
  note: z.string().max(300).optional(),
  wasteType: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reflectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { userId, habitLogId, mood, note, wasteType } = parsed.data;

    const docRef = await addDoc(collection(db, 'reflections'), {
      userId,
      habitLogId,
      mood,
      note: note ?? '',
      wasteType,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, reflectionId: docRef.id });
  } catch (error) {
    console.error('Reflection API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
