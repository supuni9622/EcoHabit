import * as functions from 'firebase-functions';
import { adminDb, COLLECTIONS } from '../utils/firebase-admin';
import * as admin from 'firebase-admin';

const WEEKLY_CHALLENGES = [
  { dayOfWeek: 0, title: 'Reflection and Planning', wasteType: 'general', target: 1, points: 30 },
  { dayOfWeek: 1, title: 'Recycle 3 Plastic Bottles', wasteType: 'plastic', target: 3, points: 30 },
  { dayOfWeek: 2, title: 'Sort Paper Recyclables', wasteType: 'paper', target: 5, points: 40 },
  { dayOfWeek: 3, title: 'Proper E-Waste Disposal', wasteType: 'e-waste', target: 1, points: 50 },
  { dayOfWeek: 4, title: 'Compost Organic Waste', wasteType: 'organic', target: 3, points: 25 },
  { dayOfWeek: 5, title: 'Plastic-Free Day', wasteType: 'plastic', target: 0, points: 60 },
  { dayOfWeek: 6, title: 'Community Clean-Up', wasteType: 'general', target: 1, points: 80 },
];

/**
 * Runs at midnight UTC every day to generate/update the daily challenge.
 * In production this would persist the challenge to Firestore for real-time access.
 */
export const generateDailyChallenge = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Colombo')
  .onRun(async (context) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const challenge = WEEKLY_CHALLENGES.find((c) => c.dayOfWeek === dayOfWeek) ?? WEEKLY_CHALLENGES[0];

    const challengeData = {
      ...challenge,
      date: today.toISOString().split('T')[0],
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      const docId = today.toISOString().split('T')[0]; // YYYY-MM-DD
      await adminDb.collection(COLLECTIONS.CHALLENGES).doc(docId).set(challengeData);
      functions.logger.info(`Daily challenge generated for ${docId}: ${challenge.title}`);
    } catch (error) {
      functions.logger.error('Error generating daily challenge:', error);
    }
  });
