import { User, HabitLog } from '../types';

export class StreakManager {
  /**
   * Calculate current streak for user
   */
  static calculateCurrentStreak(user: User): number {
    if (!user.habits || user.habits.length === 0) return 0;
    
    const sortedHabits = user.habits.sort((a, b) => 
      new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const habit of sortedHabits) {
      const habitDate = new Date(habit.loggedAt);
      habitDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - habitDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate = new Date(habitDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  }
  
  /**
   * Check if user has logged today
   */
  static hasLoggedToday(user: User): boolean {
    if (!user.habits || user.habits.length === 0) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return user.habits.some(habit => {
      const habitDate = new Date(habit.loggedAt);
      habitDate.setHours(0, 0, 0, 0);
      return habitDate.getTime() === today.getTime();
    });
  }
  
  /**
   * Get streak status for user
   */
  static getStreakStatus(user: User): {
    currentStreak: number;
    hasLoggedToday: boolean;
    daysUntilStreakBreak: number;
    longestStreak: number;
    streakStartDate: Date | null;
  } {
    const currentStreak = this.calculateCurrentStreak(user);
    const hasLoggedToday = this.hasLoggedToday(user);
    const longestStreak = this.calculateLongestStreak(user);
    const streakStartDate = this.getStreakStartDate(user);
    
    // Calculate days until streak breaks (if not logged today)
    let daysUntilStreakBreak = 0;
    if (!hasLoggedToday && currentStreak > 0) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      
      const timeUntilBreak = tomorrow.getTime() - today.getTime();
      daysUntilStreakBreak = Math.ceil(timeUntilBreak / (1000 * 60 * 60 * 24));
    }
    
    return {
      currentStreak,
      hasLoggedToday,
      daysUntilStreakBreak,
      longestStreak,
      streakStartDate,
    };
  }
  
  /**
   * Calculate longest streak for user
   */
  static calculateLongestStreak(user: User): number {
    if (!user.habits || user.habits.length === 0) return 0;
    
    const sortedHabits = user.habits.sort((a, b) => 
      new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()
    );
    
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;
    
    for (const habit of sortedHabits) {
      const habitDate = new Date(habit.loggedAt);
      habitDate.setHours(0, 0, 0, 0);
      
      if (lastDate === null) {
        currentStreak = 1;
      } else {
        const daysDiff = Math.floor((habitDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          currentStreak++;
        } else if (daysDiff > 1) {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }
      
      lastDate = habitDate;
    }
    
    return Math.max(longestStreak, currentStreak);
  }
  
  /**
   * Get streak start date
   */
  static getStreakStartDate(user: User): Date | null {
    if (!user.habits || user.habits.length === 0) return null;
    
    const sortedHabits = user.habits.sort((a, b) => 
      new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );
    
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedHabits.length; i++) {
      const habit = sortedHabits[i];
      const habitDate = new Date(habit.loggedAt);
      habitDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - habitDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff !== i) {
        return i > 0 ? new Date(sortedHabits[i - 1].loggedAt) : null;
      }
    }
    
    return sortedHabits.length > 0 ? new Date(sortedHabits[sortedHabits.length - 1].loggedAt) : null;
  }
  
  /**
   * Check if streak will break
   */
  static willStreakBreak(user: User): boolean {
    const status = this.getStreakStatus(user);
    return !status.hasLoggedToday && status.currentStreak > 0;
  }
  
  /**
   * Get streak milestones
   */
  static getStreakMilestones(): Array<{ days: number; title: string; points: number }> {
    return [
      { days: 3, title: 'Getting Started', points: 50 },
      { days: 7, title: 'Week Warrior', points: 100 },
      { days: 14, title: 'Two Week Champion', points: 200 },
      { days: 30, title: 'Monthly Master', points: 500 },
      { days: 60, title: 'Two Month Titan', points: 1000 },
      { days: 100, title: 'Century Streak', points: 2000 },
      { days: 365, title: 'Year Long Legend', points: 5000 },
    ];
  }
  
  /**
   * Get next streak milestone
   */
  static getNextStreakMilestone(currentStreak: number): { days: number; title: string; points: number } | null {
    const milestones = this.getStreakMilestones();
    return milestones.find(milestone => milestone.days > currentStreak) || null;
  }
  
  /**
   * Calculate streak bonus points
   */
  static calculateStreakBonus(streak: number): number {
    if (streak >= 365) return 1000; // 1 year streak
    if (streak >= 100) return 500;  // 100 day streak
    if (streak >= 30) return 200;   // 30 day streak
    if (streak >= 7) return 50;     // 7 day streak
    return 0; // No bonus for short streaks
  }
  
  /**
   * Get streak encouragement message
   */
  static getStreakEncouragement(streak: number): string {
    if (streak >= 365) return "🏆 You're a legend! 1 year streak!";
    if (streak >= 100) return "🔥 Incredible! 100 days strong!";
    if (streak >= 30) return "⭐ Amazing! Monthly master!";
    if (streak >= 7) return "💪 Great job! Week warrior!";
    if (streak >= 3) return "🌱 Nice start! Keep it up!";
    return "🌿 Every day counts!";
  }
}
