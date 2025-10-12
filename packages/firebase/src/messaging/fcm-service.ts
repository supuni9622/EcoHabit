import { messaging } from '../config/firebase-config';
import { getToken, onMessage } from 'firebase/messaging';

export class FCMService {
  /**
   * Get FCM token
   */
  static async getToken(): Promise<string | null> {
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
  
  /**
   * Listen for messages
   */
  static onMessage(callback: (payload: any) => void): () => void {
    if (!messaging) return () => {};
    
    return onMessage(messaging, callback);
  }
}
