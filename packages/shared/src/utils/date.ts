/**
 * Date utility functions for EcoHabit
 */

export const dateUtils = {
  /**
   * Format date to readable string
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  },
  
  /**
   * Format date to short string
   */
  formatDateShort(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  },
  
  /**
   * Get relative time string (e.g., "2 days ago")
   */
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  },
  
  /**
   * Check if two dates are the same day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  },
  
  /**
   * Get start of day
   */
  getStartOfDay(date: Date): Date {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  },
  
  /**
   * Get end of day
   */
  getEndOfDay(date: Date): Date {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  },
  
  /**
   * Get days between two dates
   */
  getDaysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  },
  
  /**
   * Add days to date
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  /**
   * Get current date in YYYY-MM-DD format
   */
  getCurrentDateString(): string {
    return new Date().toISOString().split('T')[0];
  },
  
  /**
   * Parse date string to Date object
   */
  parseDateString(dateString: string): Date {
    return new Date(dateString);
  },
  
  /**
   * Check if date is today
   */
  isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  },
  
  /**
   * Check if date is yesterday
   */
  isYesterday(date: Date): boolean {
    const yesterday = this.addDays(new Date(), -1);
    return this.isSameDay(date, yesterday);
  },
  
  /**
   * Get week number of year
   */
  getWeekNumber(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    return Math.ceil((diff / (1000 * 60 * 60 * 24) + start.getDay() + 1) / 7);
  },
  
  /**
   * Get month name
   */
  getMonthName(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  },
  
  /**
   * Get day name
   */
  getDayName(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  },
};
