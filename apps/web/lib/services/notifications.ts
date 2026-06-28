import { getMessagingService } from '../firebase/config';
import { getToken, onMessage } from 'firebase/messaging';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;
  const messaging = await getMessagingService();
  if (!messaging) return null;
  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    return token ?? null;
  } catch {
    return null;
  }
}

export async function saveFCMToken(userId: string, token: string): Promise<void> {
  await fetch('/api/users/fcm-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, token }),
  });
}

export function listenForForegroundMessages(callback: (payload: unknown) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  let unsubscribe = () => {};
  getMessagingService().then((messaging) => {
    if (!messaging) return;
    unsubscribe = onMessage(messaging, callback);
  });
  return () => unsubscribe();
}
