import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { app } from '../firebase/config';

async function getAnalyticsInstance() {
  if (typeof window === 'undefined') return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getAnalytics(app);
}

export async function trackHabitLogged(wasteType: string, points: number) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, 'habit_logged', { waste_type: wasteType, points });
}

export async function trackLessonCompleted(day: number, score: number) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, 'lesson_completed', { day, quiz_score: score });
}

export async function trackBadgeUnlocked(badgeId: string) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, 'badge_unlocked', { badge_id: badgeId });
}

export async function trackChallengeJoined(challengeId: string) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, 'challenge_joined', { challenge_id: challengeId });
}
