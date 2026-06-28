import { getMessagingService } from '../config/firebase-config';
import { getToken, onMessage, type Messaging } from 'firebase/messaging';

export class FCMService {
  static async getToken(): Promise<string | null> {
    const messaging = await getMessagingService();
    if (!messaging) return null;

    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  static async onMessage(callback: (payload: unknown) => void): Promise<() => void> {
    const messaging: Messaging | null = await getMessagingService();
    if (!messaging) return () => {};
    return onMessage(messaging, callback);
  }
}
