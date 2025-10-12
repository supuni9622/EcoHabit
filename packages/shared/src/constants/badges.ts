import { Badge } from '../types';

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first eco-action',
    icon: '🌱',
    rarity: 'common',
    requirements: {
      actions: 1,
    },
    rewards: {
      points: 50,
      features: ['basic_avatar'],
    },
  },
  {
    id: 'plastic_protector',
    name: 'Plastic Protector',
    description: 'Recycle 10 plastic items',
    icon: '🛡️',
    rarity: 'uncommon',
    requirements: {
      actions: 10,
      wasteTypes: ['plastic'],
    },
    rewards: {
      points: 100,
      features: ['plastic_avatar_accessory'],
    },
  },
  {
    id: 'paper_pioneer',
    name: 'Paper Pioneer',
    description: 'Recycle 20 paper items',
    icon: '📄',
    rarity: 'uncommon',
    requirements: {
      actions: 20,
      wasteTypes: ['paper'],
    },
    rewards: {
      points: 150,
      features: ['paper_avatar_accessory'],
    },
  },
  {
    id: 'e_waste_eliminator',
    name: 'E-Waste Eliminator',
    description: 'Recycle 5 electronic items',
    icon: '💻',
    rarity: 'rare',
    requirements: {
      actions: 5,
      wasteTypes: ['e-waste'],
    },
    rewards: {
      points: 200,
      features: ['tech_avatar_accessory'],
    },
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'rare',
    requirements: {
      streak: 7,
    },
    rewards: {
      points: 200,
      features: ['streak_animation'],
    },
  },
  {
    id: 'monthly_warrior',
    name: 'Monthly Warrior',
    description: 'Maintain a 30-day streak',
    icon: '⚔️',
    rarity: 'epic',
    requirements: {
      streak: 30,
    },
    rewards: {
      points: 500,
      features: ['warrior_avatar', 'special_animations'],
    },
  },
  {
    id: 'eco_warrior',
    name: 'Eco Warrior',
    description: 'Earn 1000 points',
    icon: '⚔️',
    rarity: 'epic',
    requirements: {
      points: 1000,
    },
    rewards: {
      points: 500,
      features: ['warrior_avatar', 'special_animations'],
    },
  },
  {
    id: 'century_streak',
    name: 'Century Streak',
    description: 'Maintain a 100-day streak',
    icon: '💯',
    rarity: 'legendary',
    requirements: {
      streak: 100,
    },
    rewards: {
      points: 1000,
      features: ['legendary_avatar', 'all_animations', 'special_title'],
      title: 'Century Champion',
    },
  },
  {
    id: 'legendary_guardian',
    name: 'Legendary Guardian',
    description: 'Earn 5000 points and maintain a 30-day streak',
    icon: '👑',
    rarity: 'legendary',
    requirements: {
      points: 5000,
      streak: 30,
    },
    rewards: {
      points: 1000,
      features: ['legendary_avatar', 'all_animations', 'special_title'],
      title: 'Eco Guardian',
    },
  },
  {
    id: 'community_champion',
    name: 'Community Champion',
    description: 'Participate in 10 community challenges',
    icon: '🏆',
    rarity: 'epic',
    requirements: {
      actions: 10,
      wasteTypes: ['community'],
    },
    rewards: {
      points: 300,
      features: ['community_avatar', 'social_features'],
    },
  },
  {
    id: 'lesson_learner',
    name: 'Lesson Learner',
    description: 'Complete 5 lessons',
    icon: '📚',
    rarity: 'uncommon',
    requirements: {
      actions: 5,
      wasteTypes: ['lesson'],
    },
    rewards: {
      points: 100,
      features: ['scholar_avatar_accessory'],
    },
  },
  {
    id: 'knowledge_keeper',
    name: 'Knowledge Keeper',
    description: 'Complete all 25 lessons',
    icon: '🧠',
    rarity: 'legendary',
    requirements: {
      actions: 25,
      wasteTypes: ['lesson'],
    },
    rewards: {
      points: 1000,
      features: ['wise_avatar', 'all_animations', 'special_title'],
      title: 'Eco Scholar',
    },
  },
];

export const BADGE_CATEGORIES = {
  ACTION: 'action',
  STREAK: 'streak',
  POINTS: 'points',
  COMMUNITY: 'community',
  LESSON: 'lesson',
  SPECIAL: 'special',
} as const;

export const BADGE_RARITY_COLORS = {
  common: '#6B7280',
  uncommon: '#10B981',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
} as const;

export const BADGE_RARITY_NAMES = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
} as const;
