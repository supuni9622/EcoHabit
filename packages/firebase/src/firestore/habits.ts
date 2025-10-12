import { db } from '../config/firebase-config';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { HabitLog } from '@ecohabit/shared';

export class HabitService {
  /**
   * Get habit log by ID
   */
  static async getHabitLog(logId: string): Promise<HabitLog | null> {
    const logDoc = await getDoc(doc(db, 'habitLogs', logId));
    if (logDoc.exists()) {
      return logDoc.data() as HabitLog;
    }
    return null;
  }
  
  /**
   * Create habit log
   */
  static async createHabitLog(habitLog: HabitLog): Promise<void> {
    await setDoc(doc(db, 'habitLogs', habitLog.id), habitLog);
  }
  
  /**
   * Update habit log
   */
  static async updateHabitLog(logId: string, updates: Partial<HabitLog>): Promise<void> {
    await updateDoc(doc(db, 'habitLogs', logId), updates);
  }
  
  /**
   * Delete habit log
   */
  static async deleteHabitLog(logId: string): Promise<void> {
    await deleteDoc(doc(db, 'habitLogs', logId));
  }
  
  /**
   * Get user's habit logs
   */
  static async getUserHabitLogs(userId: string): Promise<HabitLog[]> {
    const q = query(
      collection(db, 'habitLogs'),
      where('userId', '==', userId),
      orderBy('loggedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as HabitLog);
  }
}
