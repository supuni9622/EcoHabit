import { db } from '../config/firebase-config';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Badge, LeaderboardEntry } from '@ecohabit/shared';

export class GamificationService {
  /**
   * Get badge by ID
   */
  static async getBadge(badgeId: string): Promise<Badge | null> {
    const badgeDoc = await getDoc(doc(db, 'badges', badgeId));
    if (badgeDoc.exists()) {
      return badgeDoc.data() as Badge;
    }
    return null;
  }
  
  /**
   * Get all badges
   */
  static async getAllBadges(): Promise<Badge[]> {
    const q = query(collection(db, 'badges'), orderBy('rarity', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Badge);
  }
  
  /**
   * Get leaderboard entries
   */
  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const q = query(collection(db, 'leaderboard'), orderBy('rank', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry);
  }
  
  /**
   * Update leaderboard entry
   */
  static async updateLeaderboardEntry(entry: LeaderboardEntry): Promise<void> {
    await setDoc(doc(db, 'leaderboard', entry.userId), entry);
  }
}
