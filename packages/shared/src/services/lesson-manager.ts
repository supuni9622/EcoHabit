import { Lesson, User } from '../types';

export class LessonManager {
  /**
   * Get lesson by day number
   */
  static getLessonByDay(day: number): Lesson | null {
    // This would typically fetch from a database
    // For now, return a mock lesson
    if (day < 1 || day > 25) return null;
    
    return {
      id: `lesson-${day}`,
      day,
      title: `Day ${day}: Eco Lesson`,
      content: {
        story: `This is the story for day ${day}. Learn about environmental impact and sustainable practices.`,
        keyMessage: `Key message for day ${day}: Every small action counts!`,
        visuals: [`/images/lessons/day-${day}-1.jpg`],
        interactiveElements: ['quiz', 'reflection'],
      },
      microAction: {
        title: `Day ${day} Challenge`,
        description: `Complete today's eco-action and earn points!`,
        points: 50,
        difficulty: 'easy' as const,
        timeRequired: 5,
        requirements: ['Take a photo', 'Log your action'],
      },
      aiPrompts: {
        reflection: `How do you feel about today's lesson on day ${day}?`,
        coaching: `What can you do differently tomorrow?`,
        encouragement: `Great job on day ${day}! Keep up the momentum!`,
        challenge: `Ready for tomorrow's challenge?`,
      },
      media: {
        images: [`/images/lessons/day-${day}-1.jpg`],
        videos: [],
        audio: [],
        threeD: [],
      },
    };
  }
  
  /**
   * Get all available lessons
   */
  static getAllLessons(): Lesson[] {
    const lessons: Lesson[] = [];
    for (let day = 1; day <= 25; day++) {
      const lesson = this.getLessonByDay(day);
      if (lesson) lessons.push(lesson);
    }
    return lessons;
  }
  
  /**
   * Check if user can access a lesson
   */
  static canAccessLesson(user: User, lessonDay: number): boolean {
    // User can access lessons up to their current day
    const userDay = this.getUserCurrentDay(user);
    return lessonDay <= userDay;
  }
  
  /**
   * Get user's current lesson day
   */
  static getUserCurrentDay(user: User): number {
    // Calculate based on user's start date and current date
    const startDate = user.createdAt;
    const currentDate = new Date();
    const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(daysDiff + 1, 25); // Max 25 days
  }
  
  /**
   * Mark lesson as completed
   */
  static markLessonCompleted(user: User, lessonId: string): User {
    const completedLessons = user.completedLessons || [];
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }
    
    return {
      ...user,
      completedLessons,
      updatedAt: new Date(),
    };
  }
  
  /**
   * Get user's lesson progress
   */
  static getUserLessonProgress(user: User): {
    currentDay: number;
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
    nextLesson: Lesson | null;
  } {
    const currentDay = this.getUserCurrentDay(user);
    const completedLessons = user.completedLessons?.length || 0;
    const totalLessons = 25;
    const progressPercentage = (completedLessons / totalLessons) * 100;
    const nextLesson = this.getLessonByDay(currentDay);
    
    return {
      currentDay,
      completedLessons,
      totalLessons,
      progressPercentage,
      nextLesson,
    };
  }
  
  /**
   * Get lesson recommendations for user
   */
  static getLessonRecommendations(user: User): Lesson[] {
    const progress = this.getUserLessonProgress(user);
    const recommendations: Lesson[] = [];
    
    // Recommend current lesson
    if (progress.nextLesson) {
      recommendations.push(progress.nextLesson);
    }
    
    // Recommend previous lessons if not completed
    for (let day = 1; day < progress.currentDay; day++) {
      const lesson = this.getLessonByDay(day);
      if (lesson && !user.completedLessons?.includes(lesson.id)) {
        recommendations.push(lesson);
      }
    }
    
    return recommendations.slice(0, 3); // Max 3 recommendations
  }
}
