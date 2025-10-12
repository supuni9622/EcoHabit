# Technical Scope Adjustment - Expo Mobile App

## Overview

This document outlines the technical scope adjustments for the Expo mobile app, focusing on push notifications, over-the-air (OTA) updates, and code-sharing opportunities to maximize development efficiency and maintain consistency across web and mobile platforms.

## 1. Push Notifications Strategy

### Expo Notifications vs Firebase FCM

#### Expo Notifications (Recommended for MVP)
```typescript
// packages/firebase/src/messaging/expo-notifications.ts
import * as Notifications from 'expo-notifications'

export class ExpoNotificationService {
  // Request permissions
  static async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync()
    return status === 'granted'
  }
  
  // Schedule daily reminders
  static async scheduleDailyReminder(time: string, timezone: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌿 Daily Eco Challenge",
        body: "Complete today's eco-action and earn points!",
        data: { type: 'daily_reminder' }
      },
      trigger: {
        hour: parseInt(time.split(':')[0]),
        minute: parseInt(time.split(':')[1]),
        repeats: true,
      },
    })
  }
  
  // Achievement notifications
  static async sendAchievementNotification(badge: Badge) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🏅 Badge Unlocked!",
        body: `You earned the ${badge.name} badge!`,
        data: { type: 'achievement', badgeId: badge.id }
      },
      trigger: null, // Send immediately
    })
  }
  
  // Streak maintenance alerts
  static async sendStreakAlert(hoursRemaining: number) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Streak Alert!",
        body: `Your streak will break in ${hoursRemaining} hours. Log an action now!`,
        data: { type: 'streak_alert' }
      },
      trigger: null,
    })
  }
}
```

#### Firebase FCM Integration (Future Enhancement)
```typescript
// packages/firebase/src/messaging/fcm-service.ts
import { getMessaging, getToken } from 'firebase/messaging'

export class FCMService {
  static async getToken(): Promise<string> {
    const messaging = getMessaging()
    const token = await getToken(messaging, {
      vapidKey: process.env.VAPID_KEY
    })
    return token
  }
  
  static async sendToDevice(token: string, notification: NotificationPayload) {
    // Send via Firebase Admin SDK
    await admin.messaging().send({
      token,
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: notification.data
    })
  }
}
```

### Notification Types & Triggers

#### 1. Daily Engagement Notifications
- **Daily Challenge Reminder**: 12:00 PM user timezone
- **Streak Maintenance**: 8:00 PM if no action logged
- **Lesson Unlock**: When new lesson becomes available

#### 2. Achievement Notifications
- **Badge Unlocked**: Immediate when badge criteria met
- **Level Up**: Immediate when user levels up
- **Streak Milestone**: 7, 14, 30, 100 day streaks

#### 3. Social Notifications
- **Friend Invitation**: When friend joins
- **Community Challenge**: New group challenges
- **Leaderboard Update**: Weekly ranking changes

#### 4. Educational Notifications
- **Lesson Reminder**: Daily lesson availability
- **Tip of the Day**: Environmental tips
- **Local Impact**: Community recycling updates

### Notification Personalization

```typescript
// packages/shared/src/services/notification-personalization.ts
export class NotificationPersonalization {
  static getPersonalizedMessage(user: User, notificationType: string): string {
    const templates = {
      daily_reminder: [
        `Hey ${user.displayName}! Ready to make today eco-friendly?`,
        `Your daily eco-action awaits, ${user.displayName}!`,
        `Time to log your green impact, ${user.displayName}!`
      ],
      achievement: [
        `Amazing work, ${user.displayName}! You're making a real difference!`,
        `Your dedication is inspiring, ${user.displayName}!`,
        `Keep up the great work, ${user.displayName}!`
      ]
    }
    
    const messages = templates[notificationType] || templates.daily_reminder
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  static getOptimalSendTime(user: User): string {
    // Analyze user's most active times
    const activeHours = user.analytics.mostActiveHours
    return activeHours.length > 0 ? activeHours[0] : '12:00'
  }
}
```

## 2. Over-the-Air (OTA) Updates Strategy

### Expo Updates Implementation

#### Basic OTA Setup
```typescript
// packages/firebase/src/updates/expo-updates.ts
import * as Updates from 'expo-updates'

export class ExpoUpdateService {
  static async checkForUpdates(): Promise<boolean> {
    try {
      const update = await Updates.checkForUpdateAsync()
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
        return true
      }
      return false
    } catch (error) {
      console.error('Update check failed:', error)
      return false
    }
  }
  
  static async enableAutoUpdates() {
    if (!__DEV__) {
      Updates.addListener(Updates.UpdateEventType.UPDATE_AVAILABLE, (event) => {
        console.log('Update available:', event)
        this.checkForUpdates()
      })
    }
  }
  
  static async forceUpdate() {
    try {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    } catch (error) {
      console.error('Force update failed:', error)
    }
  }
}
```

#### Staged Rollouts
```typescript
// packages/firebase/src/updates/staged-rollout.ts
export class StagedRolloutService {
  static async shouldReceiveUpdate(userId: string, updateId: string): Promise<boolean> {
    // Implement staged rollout logic
    const userHash = this.hashUserId(userId)
    const rolloutPercentage = await this.getRolloutPercentage(updateId)
    
    return (userHash % 100) < rolloutPercentage
  }
  
  static async getRolloutPercentage(updateId: string): Promise<number> {
    // Check Firebase for rollout configuration
    const doc = await db.collection('updates').doc(updateId).get()
    return doc.data()?.rolloutPercentage || 0
  }
}
```

### Update Types & Strategy

#### 1. Critical Updates (Immediate)
- **Security fixes**: Force update within 24 hours
- **Critical bugs**: Force update within 48 hours
- **Performance issues**: Staged rollout over 1 week

#### 2. Feature Updates (Staged)
- **New features**: 10% → 50% → 100% over 2 weeks
- **UI improvements**: 25% → 75% → 100% over 1 week
- **Gamification updates**: 5% → 25% → 100% over 3 weeks

#### 3. Content Updates (Background)
- **Lesson content**: Automatic without app restart
- **Challenge updates**: Automatic without app restart
- **Localization**: Automatic without app restart

### Update Monitoring

```typescript
// packages/firebase/src/updates/update-monitoring.ts
export class UpdateMonitoringService {
  static async trackUpdateSuccess(updateId: string, userId: string) {
    await db.collection('update_analytics').add({
      updateId,
      userId,
      success: true,
      timestamp: new Date(),
      deviceInfo: await this.getDeviceInfo()
    })
  }
  
  static async trackUpdateFailure(updateId: string, userId: string, error: string) {
    await db.collection('update_analytics').add({
      updateId,
      userId,
      success: false,
      error,
      timestamp: new Date(),
      deviceInfo: await this.getDeviceInfo()
    })
  }
}
```

## 3. Code-Sharing Opportunities

### Shared Business Logic

#### 1. Gamification Engine
```typescript
// packages/shared/src/services/gamification-engine.ts
export class GamificationEngine {
  // Points calculation (shared between web and mobile)
  static calculatePoints(wasteType: string, quantity: number): number {
    const basePoints = POINT_VALUES[wasteType]
    const multiplier = quantity >= 10 ? 1.5 : quantity >= 5 ? 1.2 : 1
    return Math.round(basePoints * quantity * multiplier)
  }
  
  // Badge unlock logic (shared)
  static checkBadgeUnlocks(user: User, action: HabitLog): Badge[] {
    const unlockedBadges: Badge[] = []
    
    for (const badge of AVAILABLE_BADGES) {
      if (this.meetsBadgeRequirements(user, badge, action)) {
        unlockedBadges.push(badge)
      }
    }
    
    return unlockedBadges
  }
  
  // Streak calculation (shared)
  static calculateStreak(user: User, newAction: HabitLog): number {
    const lastAction = user.habits[user.habits.length - 1]
    const daysDiff = this.getDaysDifference(lastAction.date, newAction.date)
    
    if (daysDiff === 1) {
      return user.currentStreak + 1
    } else if (daysDiff === 0) {
      return user.currentStreak
    } else {
      return 1 // Reset streak
    }
  }
}
```

#### 2. Habit Tracking Logic
```typescript
// packages/shared/src/services/habit-tracker.ts
export class HabitTracker {
  // Action validation (shared)
  static validateAction(action: HabitLog): ValidationResult {
    const errors: string[] = []
    
    if (!action.wasteType || !WASTE_TYPES.includes(action.wasteType)) {
      errors.push('Invalid waste type')
    }
    
    if (!action.quantity || action.quantity < 1 || action.quantity > 100) {
      errors.push('Quantity must be between 1 and 100')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  // Impact calculation (shared)
  static calculateEnvironmentalImpact(action: HabitLog): EnvironmentalImpact {
    const impactFactors = IMPACT_FACTORS[action.wasteType]
    
    return {
      co2Saved: action.quantity * impactFactors.co2PerKg,
      waterSaved: action.quantity * impactFactors.waterPerItem,
      wildlifeSaved: action.quantity * impactFactors.wildlifePerItem,
      treesEquivalent: action.quantity * impactFactors.treesPerItem
    }
  }
}
```

#### 3. AI Chat Integration
```typescript
// packages/shared/src/services/ai-chat.ts
export class AIChatService {
  // Gemini API integration (shared)
  static async sendMessage(message: string, context: UserContext): Promise<string> {
    const prompt = this.buildPrompt(message, context)
    
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context })
    })
    
    return response.json()
  }
  
  // Reflection prompts (shared)
  static getReflectionPrompt(user: User, lesson: Lesson): string {
    const prompts = {
      daily: "How do you feel about today's eco-action?",
      lesson: `What did you learn from "${lesson.title}"?`,
      achievement: "How does earning this badge make you feel?",
      streak: "What motivates you to maintain your streak?"
    }
    
    return prompts[user.currentContext] || prompts.daily
  }
}
```

### Shared UI Components

#### 1. Cross-Platform Components
```typescript
// packages/ui/src/components/ProgressBar.tsx
export const ProgressBar = ({ 
  current, 
  target, 
  color = 'green' 
}: ProgressBarProps) => {
  const percentage = Math.min((current / target) * 100, 100)
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.fill, 
          { width: `${percentage}%`, backgroundColor: color }
        ]} 
      />
      <Text style={styles.text}>{current}/{target}</Text>
    </View>
  )
}
```

#### 2. Platform-Specific Adaptations
```typescript
// packages/ui/src/components/Button.tsx
export const Button = ({ 
  children, 
  onPress, 
  variant = 'primary' 
}: ButtonProps) => {
  const styles = usePlatformStyles(variant)
  
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  )
}

// Platform-specific styling
const usePlatformStyles = (variant: string) => {
  const isWeb = Platform.OS === 'web'
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android'
  
  return {
    button: {
      ...(isWeb ? webButtonStyles : mobileButtonStyles),
      ...variantStyles[variant]
    },
    text: {
      ...(isWeb ? webTextStyles : mobileTextStyles)
    }
  }
}
```

### Shared Firebase Integration

#### 1. Database Operations
```typescript
// packages/firebase/src/firestore/habits.ts
export class HabitService {
  // Log action (shared)
  static async logAction(userId: string, action: HabitLog): Promise<void> {
    const batch = db.batch()
    
    // Add habit log
    const logRef = db.collection('habitLogs').doc()
    batch.set(logRef, {
      ...action,
      userId,
      loggedAt: new Date(),
      points: GamificationEngine.calculatePoints(action.wasteType, action.quantity)
    })
    
    // Update user stats
    const userRef = db.collection('users').doc(userId)
    batch.update(userRef, {
      'gamification.totalPoints': FieldValue.increment(action.points),
      'progress.totalActionsLogged': FieldValue.increment(1)
    })
    
    await batch.commit()
  }
  
  // Get user habits (shared)
  static async getUserHabits(userId: string): Promise<HabitLog[]> {
    const snapshot = await db
      .collection('habitLogs')
      .where('userId', '==', userId)
      .orderBy('loggedAt', 'desc')
      .limit(50)
      .get()
    
    return snapshot.docs.map(doc => doc.data() as HabitLog)
  }
}
```

#### 2. Authentication
```typescript
// packages/firebase/src/auth/auth-service.ts
export class AuthService {
  // Sign in (shared)
  static async signInWithEmail(email: string, password: string): Promise<User> {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    return this.mapFirebaseUser(user)
  }
  
  // Sign up (shared)
  static async signUpWithEmail(email: string, password: string): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    return this.mapFirebaseUser(user)
  }
  
  // Social login (shared)
  static async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider()
    const { user } = await signInWithPopup(auth, provider)
    return this.mapFirebaseUser(user)
  }
}
```

## 4. Development Workflow Integration

### Shared Development Tools

#### 1. TypeScript Configuration
```json
// packages/shared/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 2. Testing Strategy
```typescript
// packages/shared/src/__tests__/gamification.test.ts
describe('GamificationEngine', () => {
  it('should calculate points correctly', () => {
    expect(GamificationEngine.calculatePoints('plastic', 5)).toBe(50)
    expect(GamificationEngine.calculatePoints('plastic', 10)).toBe(150)
  })
  
  it('should check badge unlocks', () => {
    const user = createMockUser({ totalPoints: 100 })
    const action = createMockAction({ wasteType: 'plastic', quantity: 5 })
    
    const badges = GamificationEngine.checkBadgeUnlocks(user, action)
    expect(badges).toContainEqual(expect.objectContaining({ id: 'plastic_protector' }))
  })
})
```

#### 3. Build Pipeline
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

## 5. Performance Optimization

### Code Splitting Strategy
```typescript
// Lazy load 3D components
const Avatar3D = lazy(() => import('./Avatar3D'))
const TrophyRoom = lazy(() => import('./TrophyRoom'))

// Conditional loading based on platform
const Gamification3D = ({ platform }: { platform: 'web' | 'mobile' }) => {
  if (platform === 'web') {
    return <Web3DAvatar />
  }
  return <Mobile3DAvatar />
}
```

### Bundle Size Optimization
```typescript
// Tree shaking for unused features
import { GamificationEngine } from '@ecohabit/shared/gamification'
// Only import what's needed

// Platform-specific imports
const usePlatformFeatures = () => {
  const isWeb = Platform.OS === 'web'
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android'
  
  return {
    enable3D: isWeb,
    enablePushNotifications: isMobile,
    enableCamera: isMobile
  }
}
```

## 6. Monitoring & Analytics

### Shared Analytics
```typescript
// packages/shared/src/analytics/analytics-service.ts
export class AnalyticsService {
  // Track user actions (shared)
  static async trackAction(action: string, properties: Record<string, any>) {
    if (Platform.OS === 'web') {
      // Web analytics
      gtag('event', action, properties)
    } else {
      // Mobile analytics
      await Analytics.logEvent(action, properties)
    }
  }
  
  // Track gamification events (shared)
  static async trackBadgeUnlock(badge: Badge, user: User) {
    await this.trackAction('badge_unlocked', {
      badgeId: badge.id,
      badgeName: badge.name,
      userLevel: user.level,
      totalPoints: user.totalPoints
    })
  }
}
```

This technical scope adjustment provides a comprehensive foundation for implementing the Expo mobile app with optimal code sharing, efficient updates, and engaging notifications while maintaining consistency with the web platform.
