/**
 * EcoHabit Firebase Cloud Functions
 * Main entry point — exports all Cloud Functions
 */

// Auth triggers
export { onUserCreate } from './triggers/auth/on-user-create';

// Firestore triggers
export { onHabitLog } from './triggers/habits/on-habit-log';
export { onLevelUp } from './triggers/gamification/on-level-up';

// Scheduled functions
export { generateDailyChallenge } from './scheduled/daily-challenges';
export { checkStreakAlerts } from './scheduled/streak-alert';
