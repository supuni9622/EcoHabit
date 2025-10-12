import { db } from '../config/firebase-config';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Lesson } from '@ecohabit/shared';

export class LessonService {
  /**
   * Get lesson by ID
   */
  static async getLesson(lessonId: string): Promise<Lesson | null> {
    const lessonDoc = await getDoc(doc(db, 'lessons', lessonId));
    if (lessonDoc.exists()) {
      return lessonDoc.data() as Lesson;
    }
    return null;
  }
  
  /**
   * Create lesson
   */
  static async createLesson(lesson: Lesson): Promise<void> {
    await setDoc(doc(db, 'lessons', lesson.id), lesson);
  }
  
  /**
   * Update lesson
   */
  static async updateLesson(lessonId: string, updates: Partial<Lesson>): Promise<void> {
    await updateDoc(doc(db, 'lessons', lessonId), updates);
  }
  
  /**
   * Delete lesson
   */
  static async deleteLesson(lessonId: string): Promise<void> {
    await deleteDoc(doc(db, 'lessons', lessonId));
  }
  
  /**
   * Get all lessons
   */
  static async getAllLessons(): Promise<Lesson[]> {
    const q = query(collection(db, 'lessons'), orderBy('day', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Lesson);
  }
}
