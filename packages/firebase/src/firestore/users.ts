import { db } from '../config/firebase-config';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User } from '@ecohabit/shared';

export class UserService {
  /**
   * Get user by ID
   */
  static async getUser(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  }
  
  /**
   * Create user
   */
  static async createUser(user: User): Promise<void> {
    await setDoc(doc(db, 'users', user.id), user);
  }
  
  /**
   * Update user
   */
  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await updateDoc(doc(db, 'users', userId), updates);
  }
  
  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId));
  }
}
