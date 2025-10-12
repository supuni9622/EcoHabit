import { db } from '../config/firebase-config';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: Date;
}

export class AnalyticsService {
  /**
   * Log analytics event
   */
  static async logEvent(event: AnalyticsEvent): Promise<void> {
    await setDoc(doc(db, 'analytics', event.id), event);
  }
  
  /**
   * Get user analytics events
   */
  static async getUserEvents(userId: string): Promise<AnalyticsEvent[]> {
    const q = query(
      collection(db, 'analytics'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as AnalyticsEvent);
  }
  
  /**
   * Get events by type
   */
  static async getEventsByType(eventType: string): Promise<AnalyticsEvent[]> {
    const q = query(
      collection(db, 'analytics'),
      where('eventType', '==', eventType),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as AnalyticsEvent);
  }
}
