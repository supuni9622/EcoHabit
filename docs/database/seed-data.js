// Database Seeding Script for EcoHabit
// Run with: node scripts/seed-data.js

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../firebase-service-account.json'); // Add your service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

const db = admin.firestore();

// Seed data for badges (based on your 25-day lesson plan)
const BADGES_SEED = [
  {
    id: 'eco_starter',
    name: 'Eco Starter',
    description: 'Started your eco journey by completing your first action',
    category: 'recycling',
    iconURL: '/images/badges/eco-starter.png',
    colorScheme: { primary: '#4CAF50', secondary: '#81C784', accent: '#FFD54F' },
    requirements: { type: 'actions_logged', threshold: 1 },
    pointsReward: 50,
    rarity: 'common',
    isActive: true,
    order: 1
  },
  {
    id: 'plastic_protector',
    name: 'Plastic Protector',
    description: 'Protected marine life by recycling 10 plastic items',
    category: 'recycling',
    iconURL: '/images/badges/plastic-protector.png',
    colorScheme: { primary: '#2196F3', secondary: '#64B5F6', accent: '#FFF176' },
    requirements: { type: 'actions_logged', threshold: 10, category: 'plastic' },
    pointsReward: 200,
    rarity: 'uncommon',
    isActive: true,
    order: 2
  },
  {
    id: 'streak_warrior_7',
    name: '7-Day Warrior',
    description: 'Maintained a 7-day recycling streak',
    category: 'streaks',
    iconURL: '/images/badges/streak-7.png',
    colorScheme: { primary: '#FF9800', secondary: '#FFB74D', accent: '#FFF9C4' },
    requirements: { type: 'streak_days', threshold: 7 },
    pointsReward: 300,
    rarity: 'uncommon',
    isActive: true,
    order: 3
  },
  {
    id: 'eco_community_builder',
    name: 'Eco Community Builder',
    description: 'Built community by inviting friends and sharing achievements',
    category: 'community',
    iconURL: '/images/badges/community-builder.png',
    colorScheme: { primary: '#9C27B0', secondary: '#BA68C8', accent: '#F8BBD9' },
    requirements: { type: 'friends_invited', threshold: 3 },
    pointsReward: 500,
    rarity: 'rare',
    isActive: true,
    order: 4
  },
  {
    id: 'eco_hero_level_1',
    name: 'Eco Hero Level 1',
    description: 'Completed the first week of your eco journey',
    category: 'learning',
    iconURL: '/images/badges/eco-hero-1.png',
    colorScheme: { primary: '#E91E63', secondary: '#F06292', accent: '#FCE4EC' },
    requirements: { type: 'lessons_completed', threshold: 7 },
    pointsReward: 750,
    rarity: 'rare',
    isActive: true,
    order: 5
  },
  {
    id: 'impact_champion',
    name: 'Impact Champion',
    description: 'Achieved significant environmental impact with your actions',
    category: 'impact',
    iconURL: '/images/badges/impact-champion.png',
    colorScheme: { primary: '#795548', secondary: '#A1887F', accent: '#D7CCC8' },
    requirements: { type: 'points_earned', threshold: 5000 },
    pointsReward: 1000,
    rarity: 'epic',
    isActive: true,
    order: 6
  }
];

// Seed data for 25-day lesson plan
const LESSONS_SEED = [
  {
    id: 'day_1_plastic_problem',
    day: 1,
    title: 'The Hidden Plastic Problem',
    subtitle: 'Understanding the invisible impact of plastic waste',
    category: 'awareness',
    story: {
      text: 'Every minute, 1 million plastic bottles are consumed worldwide. Many end up in rivers and oceans, entangling turtles and sea birds. Imagine a baby turtle struggling to swim through a sea of plastic.',
      hook: 'See how plastic affects oceans & wildlife',
      visualPrompt: 'A turtle entangled in plastic bottles floating in a polluted ocean, realistic, emotional, cinematic lighting',
      estimatedReadTime: 2
    },
    microAction: {
      description: 'Log 1 plastic item you recycled today',
      type: 'log_recycling',
      pointsReward: 50,
      requiredForProgress: true
    },
    aiPrompts: {
      reflectionPrompt: 'How do you feel seeing the impact of plastic on wildlife?',
      followUpQuestions: [
        'What plastic items do you use most frequently?',
        'How might you reduce your plastic consumption?'
      ],
      encouragementMessages: [
        'Your awareness is the first step to making a difference!',
        'Every small action counts toward protecting our oceans.'
      ]
    },
    feedbackLoop: {
      immediateReward: 'Amazing! You just prevented microplastics from entering the ocean.',
      impactVisualization: 'You prevented X microplastics from entering the ocean',
      socialValidation: 'Share your commitment to reducing plastic waste!'
    },
    media: {
      heroImage: '/images/lessons/day1-plastic-ocean.jpg',
      thumbnailImage: '/images/lessons/thumbs/day1.jpg'
    },
    isActive: true,
    difficultyLevel: 1
  },
  {
    id: 'day_2_small_actions',
    day: 2,
    title: 'Small Actions Matter',
    subtitle: 'Every individual choice creates ripple effects',
    category: 'empowerment',
    story: {
      text: 'One person\'s choice can create a ripple effect. Using reusable bags, bottles, and containers protects our oceans and community.',
      hook: 'Every small action creates big impact',
      visualPrompt: 'Family using reusable bags and bottles, colorful illustration, positive and energetic style',
      estimatedReadTime: 2
    },
    microAction: {
      description: 'Replace 1 disposable plastic item with a reusable alternative',
      type: 'log_recycling',
      pointsReward: 75,
      requiredForProgress: true
    },
    aiPrompts: {
      reflectionPrompt: 'Share one small eco-change you can start today. How does it make you feel?',
      followUpQuestions: [
        'What reusable alternatives do you already own?',
        'Which single-use items could you easily replace?'
      ],
      encouragementMessages: [
        'Small changes add up to big environmental wins!',
        'You\'re building momentum for lasting change.'
      ]
    },
    feedbackLoop: {
      immediateReward: 'Fantastic! Your switch to reusables prevents waste every day.',
      impactVisualization: 'Your reusable choice prevents X items of waste annually',
      socialValidation: 'Inspire others by sharing your sustainable swaps!'
    },
    media: {
      heroImage: '/images/lessons/day2-reusable-family.jpg',
      thumbnailImage: '/images/lessons/thumbs/day2.jpg'
    },
    isActive: true,
    prerequisites: [1],
    difficultyLevel: 1
  },
  // Add more lessons following the 25-day plan...
  {
    id: 'day_7_habit_formation',
    day: 7,
    title: 'Reflection & Habit Formation',
    subtitle: 'Celebrating your first week of impact',
    category: 'reflection',
    story: {
      text: 'A week of eco-actions creates measurable impact. Small daily habits turn into lifelong sustainable behavior.',
      hook: 'Build a lasting eco-action habit',
      visualPrompt: 'Montage of eco-actions: people recycling, planting trees, and clean oceans, cinematic storytelling, motivational',
      estimatedReadTime: 3
    },
    microAction: {
      description: 'Reflect on your week and plan next week\'s eco-actions',
      type: 'reflection',
      pointsReward: 200,
      requiredForProgress: true
    },
    aiPrompts: {
      reflectionPrompt: 'Reflect on your week: What was the most rewarding action? How do you feel about continuing this habit?',
      followUpQuestions: [
        'Which actions felt most natural to you?',
        'What challenges did you face this week?',
        'How will you maintain momentum next week?'
      ],
      encouragementMessages: [
        'You\'ve built the foundation for lasting change!',
        'Your consistency this week shows real commitment.',
        'You\'re inspiring others through your actions.'
      ]
    },
    feedbackLoop: {
      immediateReward: 'Incredible! You\'ve completed your first eco-week!',
      impactVisualization: 'This week you prevented X kg of waste from landfills',
      socialValidation: 'Share your Eco Hero Level 1 achievement!'
    },
    media: {
      heroImage: '/images/lessons/day7-celebration.jpg',
      thumbnailImage: '/images/lessons/thumbs/day7.jpg'
    },
    isActive: true,
    prerequisites: [1, 2, 3, 4, 5, 6],
    difficultyLevel: 2
  }
];

// Seed data for challenges
const CHALLENGES_SEED = [
  {
    id: 'plastic_free_week',
    title: 'Plastic-Free Week Challenge',
    description: 'Avoid single-use plastics for 7 consecutive days',
    type: 'weekly',
    requirements: {
      actionType: 'plastic',
      targetQuantity: 7,
      timeframe: {
        duration: 7,
        startDate: admin.firestore.Timestamp.now(),
        endDate: admin.firestore.Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    },
    rewards: {
      points: 500,
      badges: ['plastic_protector'],
      title: 'Plastic-Free Champion'
    },
    participants: {
      currentCount: 0,
      maxParticipants: 1000,
      leaderboard: []
    },
    isActive: true,
    featured: true,
    difficulty: 'medium'
  },
  {
    id: 'daily_recycler',
    title: 'Daily Recycler',
    description: 'Log at least one recycling action every day this month',
    type: 'monthly',
    requirements: {
      actionType: 'any',
      targetQuantity: 30,
      timeframe: {
        duration: 30,
        startDate: admin.firestore.Timestamp.now(),
        endDate: admin.firestore.Timestamp.fromMillis(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    },
    rewards: {
      points: 1000,
      badges: ['impact_champion']
    },
    participants: {
      currentCount: 0,
      leaderboard: []
    },
    isActive: true,
    featured: false,
    difficulty: 'hard'
  }
];

// Seed data for recycling locations (Sri Lanka focus)
const RECYCLING_LOCATIONS_SEED = [
  {
    id: 'colombo_recycling_center_1',
    name: 'Green Planet Recycling Center',
    address: {
      street: '123 Galle Road',
      city: 'Colombo',
      province: 'Western Province',
      postalCode: '00300',
      country: 'Sri Lanka'
    },
    coordinates: {
      latitude: 6.9271,
      longitude: 79.8612
    },
    acceptedWasteTypes: ['plastic', 'paper', 'e-waste', 'glass', 'metal'],
    operatingHours: {
      monday: { open: '08:00', close: '17:00', closed: false },
      tuesday: { open: '08:00', close: '17:00', closed: false },
      wednesday: { open: '08:00', close: '17:00', closed: false },
      thursday: { open: '08:00', close: '17:00', closed: false },
      friday: { open: '08:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '15:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    },
    contact: {
      phone: '+94-11-234-5678',
      email: 'info@greenplanetlk.com',
      website: 'https://greenplanetlk.com'
    },
    rating: {
      average: 4.5,
      count: 23,
      reviews: []
    },
    verified: true,
    verifiedAt: admin.firestore.Timestamp.now(),
    lastUpdated: admin.firestore.Timestamp.now()
  },
  {
    id: 'kandy_eco_center',
    name: 'Kandy Eco Waste Management',
    address: {
      street: '45 Peradeniya Road',
      city: 'Kandy',
      province: 'Central Province',
      postalCode: '20000',
      country: 'Sri Lanka'
    },
    coordinates: {
      latitude: 7.2906,
      longitude: 80.6337
    },
    acceptedWasteTypes: ['plastic', 'paper', 'organic'],
    operatingHours: {
      monday: { open: '09:00', close: '16:00', closed: false },
      tuesday: { open: '09:00', close: '16:00', closed: false },
      wednesday: { open: '09:00', close: '16:00', closed: false },
      thursday: { open: '09:00', close: '16:00', closed: false },
      friday: { open: '09:00', close: '16:00', closed: false },
      saturday: { open: '10:00', close: '14:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    },
    contact: {
      phone: '+94-81-123-4567'
    },
    rating: {
      average: 4.2,
      count: 15,
      reviews: []
    },
    verified: true,
    verifiedAt: admin.firestore.Timestamp.now(),
    lastUpdated: admin.firestore.Timestamp.now()
  }
];

// Seed data for notification templates
const NOTIFICATION_TEMPLATES_SEED = [
  {
    id: 'daily_reminder',
    type: 'daily_reminder',
    templates: {
      title: 'Time for your eco-action! 🌱',
      body: 'Hey {userName}, ready to make a positive impact today? Log your recycling actions now!',
      actionButton: 'Log Action',
      deepLink: '/habits/log'
    },
    variables: ['userName'],
    triggers: {
      condition: 'daily_at_preferred_time',
      timing: 'optimal_time',
      frequency: 'daily'
    },
    isActive: true
  },
  {
    id: 'streak_alert',
    type: 'streak_alert',
    templates: {
      title: 'Don\'t break your streak! 🔥',
      body: '{userName}, you\'re on a {streakDays}-day streak! Keep the momentum going.',
      actionButton: 'Continue Streak',
      deepLink: '/habits/log'
    },
    variables: ['userName', 'streakDays'],
    triggers: {
      condition: 'streak_at_risk',
      timing: 'scheduled',
      frequency: 'once'
    },
    isActive: true
  },
  {
    id: 'badge_unlock',
    type: 'badge_unlock',
    templates: {
      title: 'New badge unlocked! 🏆',
      body: 'Congratulations {userName}! You earned the "{badgeName}" badge!',
      actionButton: 'View Badge',
      deepLink: '/profile/achievements'
    },
    variables: ['userName', 'badgeName'],
    triggers: {
      condition: 'badge_earned',
      timing: 'immediate',
      frequency: 'once'
    },
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed badges
    console.log('📛 Seeding badges...');
    for (const badge of BADGES_SEED) {
      await db.collection('badges').doc(badge.id).set({
        ...badge,
        createdAt: admin.firestore.Timestamp.now()
      });
    }
    console.log(`✅ Seeded ${BADGES_SEED.length} badges`);

    // Seed lessons
    console.log('📚 Seeding lessons...');
    for (const lesson of LESSONS_SEED) {
      await db.collection('lessons').doc(lesson.id).set({
        ...lesson,
        createdAt: admin.firestore.Timestamp.now()
      });
    }
    console.log(`✅ Seeded ${LESSONS_SEED.length} lessons`);

    // Seed challenges
    console.log('🎯 Seeding challenges...');
    for (const challenge of CHALLENGES_SEED) {
      await db.collection('challenges').doc(challenge.id).set({
        ...challenge,
        createdAt: admin.firestore.Timestamp.now()
      });
    }
    console.log(`✅ Seeded ${CHALLENGES_SEED.length} challenges`);

    // Seed recycling locations
    console.log('📍 Seeding recycling locations...');
    for (const location of RECYCLING_LOCATIONS_SEED) {
      await db.collection('recyclingLocations').doc(location.id).set({
        ...location,
        createdAt: admin.firestore.Timestamp.now()
      });
    }
    console.log(`✅ Seeded ${RECYCLING_LOCATIONS_SEED.length} recycling locations`);

    // Seed notification templates
    console.log('🔔 Seeding notification templates...');
    for (const template of NOTIFICATION_TEMPLATES_SEED) {
      await db.collection('notificationTemplates').doc(template.id).set({
        ...template,
        createdAt: admin.firestore.Timestamp.now()
      });
    }
    console.log(`✅ Seeded ${NOTIFICATION_TEMPLATES_SEED.length} notification templates`);

    // Create initial system metrics document
    console.log('📊 Creating initial system metrics...');
    const today = new Date().toISOString().split('T')[0];
    await db.collection('systemMetrics').doc(today).set({
      metrics: {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        totalActionsLogged: 0,
        totalPointsAwarded: 0,
        avgSessionLength: 0,
        retentionRate: {
          day1: 0,
          day7: 0,
          day30: 0
        }
      },
      impact: {
        totalWasteRecycled: 0,
        co2SavedEstimate: 0,
        waterSavedEstimate: 0,
        wildlifeHelpedEstimate: 0
      },
      featureUsage: {
        aiChatSessions: 0,
        lessonsCompleted: 0,
        challengesJoined: 0,
        socialInteractions: 0,
        mapSearches: 0
      },
      timestamp: admin.firestore.Timestamp.now()
    });
    console.log('✅ Created initial system metrics');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📈 Summary:
- ${BADGES_SEED.length} badges created
- ${LESSONS_SEED.length} lessons created  
- ${CHALLENGES_SEED.length} challenges created
- ${RECYCLING_LOCATIONS_SEED.length} recycling locations created
- ${NOTIFICATION_TEMPLATES_SEED.length} notification templates created
- 1 system metrics document created

🚀 Your EcoHabit database is ready for development!
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };