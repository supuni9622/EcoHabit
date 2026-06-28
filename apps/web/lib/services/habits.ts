import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { POINT_VALUES } from '@ecohabit/shared';

const DAILY_POINTS_CAP = 500;

export interface HabitLogInput {
  userId: string;
  wasteType: string;
  quantity: number;
  notes?: string;
}

export interface HabitLogRecord {
  id: string;
  userId: string;
  wasteType: string;
  quantity: number;
  pointsAwarded: number;
  notes: string;
  co2Saved: number;
  waterSaved: number;
  loggedAt: Date;
}

function calcPoints(wasteType: string, quantity: number): number {
  const base = POINT_VALUES[wasteType] ?? 5;
  return base * quantity;
}

function calcImpact(wasteType: string, quantity: number): { co2: number; water: number } {
  const factors: Record<string, { co2: number; water: number }> = {
    plastic: { co2: 0.5, water: 0.2 },
    paper: { co2: 0.3, water: 0.15 },
    'e-waste': { co2: 2.0, water: 0.5 },
    organic: { co2: 0.2, water: 0.1 },
    glass: { co2: 0.4, water: 0.18 },
    metal: { co2: 0.8, water: 0.3 },
    textile: { co2: 0.6, water: 0.25 },
    general: { co2: 0.3, water: 0.12 },
    other: { co2: 0.3, water: 0.12 },
  };
  const f = factors[wasteType] ?? { co2: 0.3, water: 0.12 };
  return {
    co2: Math.round(f.co2 * quantity * 100) / 100,
    water: Math.round(f.water * quantity * 1000) / 1000,
  };
}

export async function getTodayPoints(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const q = query(
    collection(db, 'habitLogs'),
    where('userId', '==', userId),
    where('loggedAt', '>=', Timestamp.fromDate(today))
  );
  const snap = await getDocs(q);
  return snap.docs.reduce((sum, d) => sum + (d.data().pointsAwarded ?? 0), 0);
}

export async function saveHabitLog(
  input: HabitLogInput,
  alreadyEarnedToday: number
): Promise<{ logId: string; pointsAwarded: number }> {
  const rawPoints = calcPoints(input.wasteType, input.quantity);
  const remaining = Math.max(0, DAILY_POINTS_CAP - alreadyEarnedToday);
  const pointsAwarded = Math.min(rawPoints, remaining);
  const impact = calcImpact(input.wasteType, input.quantity);

  const docRef = await addDoc(collection(db, 'habitLogs'), {
    userId: input.userId,
    wasteType: input.wasteType,
    quantity: input.quantity,
    pointsAwarded,
    notes: input.notes ?? '',
    co2Saved: impact.co2,
    waterSaved: impact.water,
    loggedAt: serverTimestamp(),
  });

  return { logId: docRef.id, pointsAwarded };
}

export async function getRecentHabitLogs(
  userId: string,
  count: number = 20
): Promise<HabitLogRecord[]> {
  const q = query(
    collection(db, 'habitLogs'),
    where('userId', '==', userId),
    orderBy('loggedAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      wasteType: data.wasteType,
      quantity: data.quantity,
      pointsAwarded: data.pointsAwarded,
      notes: data.notes,
      co2Saved: data.co2Saved,
      waterSaved: data.waterSaved,
      loggedAt: data.loggedAt?.toDate?.() ?? new Date(),
    };
  });
}

export async function getTodayHabitLogs(userId: string): Promise<HabitLogRecord[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const q = query(
    collection(db, 'habitLogs'),
    where('userId', '==', userId),
    where('loggedAt', '>=', Timestamp.fromDate(today)),
    orderBy('loggedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      wasteType: data.wasteType,
      quantity: data.quantity,
      pointsAwarded: data.pointsAwarded,
      notes: data.notes,
      co2Saved: data.co2Saved,
      waterSaved: data.waterSaved,
      loggedAt: data.loggedAt?.toDate?.() ?? new Date(),
    };
  });
}
