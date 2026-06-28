import { Badge } from '../types';

// Point values for different waste types
export const POINT_VALUES: Record<string, number> = {
  plastic: 10,
  paper: 8,
  'e-waste': 20,
  organic: 5,
  glass: 12,
  metal: 14,
  textile: 6,
  general: 5,
  other: 5,
};

// Daily cap for points
export const DAILY_POINTS_CAP = 500;

// Badge requirements and rewards
export const BADGE_REQUIREMENTS: Badge[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first eco-action',
    icon: '🌱',
    rarity: 'common' as const,
    requirements: {
      actions: 1,
    },
    rewards: {
      points: 50,
      features: ['basic_avatar'] as string[],
    },
  },
  {
    id: 'plastic_protector',
    name: 'Plastic Protector',
    description: 'Recycle 10 plastic items',
    icon: '🛡️',
    rarity: 'uncommon' as const,
    requirements: {
      actions: 10,
      wasteTypes: ['plastic'],
    },
    rewards: {
      points: 100,
      features: ['plastic_avatar_accessory'] as string[],
    },
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'rare' as const,
    requirements: {
      streak: 7,
    },
    rewards: {
      points: 200,
      features: ['streak_animation'] as string[],
    },
  },
  {
    id: 'eco_warrior',
    name: 'Eco Warrior',
    description: 'Earn 1000 points',
    icon: '🌟',
    rarity: 'epic' as const,
    requirements: {
      points: 1000,
    },
    rewards: {
      points: 500,
      features: ['warrior_avatar', 'special_animations'] as string[],
    },
  },
  {
    id: 'legendary_guardian',
    name: 'Legendary Guardian',
    description: 'Earn 5000 points and maintain a 30-day streak',
    icon: '👑',
    rarity: 'legendary' as const,
    requirements: {
      points: 5000,
      streak: 30,
    },
    rewards: {
      points: 1000,
      features: ['legendary_avatar', 'all_animations', 'special_title'] as string[],
      title: 'Eco Guardian',
    },
  },
  {
    id: 'glass_hero',
    name: 'Glass Hero',
    description: 'Recycle 15 glass items',
    icon: '🍶',
    rarity: 'uncommon' as const,
    requirements: {
      actions: 15,
      wasteTypes: ['glass'],
    },
    rewards: {
      points: 120,
      features: ['glass_avatar_accessory'] as string[],
    },
  },
  {
    id: 'metal_master',
    name: 'Metal Master',
    description: 'Recycle 10 metal items',
    icon: '🥫',
    rarity: 'uncommon' as const,
    requirements: {
      actions: 10,
      wasteTypes: ['metal'],
    },
    rewards: {
      points: 120,
      features: ['metal_avatar_accessory'] as string[],
    },
  },
  {
    id: 'organic_champion',
    name: 'Organic Champion',
    description: 'Compost 20 organic items',
    icon: '🌿',
    rarity: 'uncommon' as const,
    requirements: {
      actions: 20,
      wasteTypes: ['organic'],
    },
    rewards: {
      points: 100,
      features: ['organic_avatar_accessory'] as string[],
    },
  },
  {
    id: 'textile_saver',
    name: 'Textile Saver',
    description: 'Recycle 5 textile items',
    icon: '👗',
    rarity: 'rare' as const,
    requirements: {
      actions: 5,
      wasteTypes: ['textile'],
    },
    rewards: {
      points: 150,
      features: ['textile_avatar_accessory'] as string[],
    },
  },
  {
    id: 'eco_explorer',
    name: 'Eco Explorer',
    description: 'Complete 3 lessons',
    icon: '🔭',
    rarity: 'common' as const,
    requirements: {
      actions: 3,
      wasteTypes: ['lesson'],
    },
    rewards: {
      points: 75,
      features: ['explorer_avatar_accessory'] as string[],
    },
  },
  {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Complete all 25 lessons',
    icon: '🎓',
    rarity: 'legendary' as const,
    requirements: {
      actions: 25,
      wasteTypes: ['lesson'],
    },
    rewards: {
      points: 1500,
      features: ['scholar_full_avatar', 'all_animations', 'special_title'] as string[],
      title: 'Eco Scholar',
    },
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 14-day streak',
    icon: '🗓️',
    rarity: 'rare' as const,
    requirements: {
      streak: 14,
    },
    rewards: {
      points: 250,
      features: ['week_warrior_accessory'] as string[],
    },
  },
  {
    id: 'action_hero',
    name: 'Action Hero',
    description: 'Log 50 total actions',
    icon: '💪',
    rarity: 'epic' as const,
    requirements: {
      actions: 50,
    },
    rewards: {
      points: 400,
      features: ['hero_avatar', 'special_animations'] as string[],
    },
  },
  {
    id: 'impact_maker',
    name: 'Impact Maker',
    description: 'Log 100 total actions',
    icon: '🌎',
    rarity: 'legendary' as const,
    requirements: {
      actions: 100,
    },
    rewards: {
      points: 800,
      features: ['impact_avatar', 'all_animations', 'special_title'] as string[],
      title: 'Impact Maker',
    },
  },
  {
    id: 'dawn_recycler',
    name: 'Dawn Recycler',
    description: 'Log an eco action before 8 AM',
    icon: '🌅',
    rarity: 'common' as const,
    requirements: {
      actions: 1,
    },
    rewards: {
      points: 50,
      features: ['dawn_avatar_accessory'] as string[],
    },
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Log eco actions on both Saturday and Sunday',
    icon: '🏖️',
    rarity: 'uncommon' as const,
    requirements: {
      actions: 2,
    },
    rewards: {
      points: 100,
      features: ['weekend_avatar_accessory'] as string[],
    },
  },
];

// Level requirements matching the documented thresholds
export const LEVEL_REQUIREMENTS = [
  { level: 1, points: 0, title: 'Eco Beginner' },
  { level: 2, points: 500, title: 'Eco Explorer' },
  { level: 3, points: 1500, title: 'Eco Enthusiast' },
  { level: 4, points: 3000, title: 'Eco Warrior' },
  { level: 5, points: 5000, title: 'Eco Champion' },
  { level: 6, points: 10000, title: 'Eco Master' },
  { level: 7, points: 20000, title: 'Eco Legend' },
  { level: 8, points: 35000, title: 'Eco Guardian' },
  { level: 9, points: 50000, title: 'Eco Hero' },
  { level: 10, points: 100000, title: 'Eco Legendary' },
] as const;

// Streak milestones
export const STREAK_MILESTONES = [
  { days: 3, title: 'Getting Started', points: 50 },
  { days: 7, title: 'Week Warrior', points: 100 },
  { days: 14, title: 'Two Week Champion', points: 200 },
  { days: 30, title: 'Monthly Master', points: 500 },
  { days: 60, title: 'Two Month Titan', points: 1000 },
  { days: 100, title: 'Century Streak', points: 2000 },
  { days: 365, title: 'Year Long Legend', points: 5000 },
] as const;

// Daily challenges rotating by day of week (0=Sunday, 1=Monday, ...)
export const WEEKLY_CHALLENGES = [
  {
    id: 'sunday_reflection',
    title: 'Reflection and Planning',
    description: 'Reflect on your eco journey and plan your week ahead',
    points: 30,
    wasteType: 'general',
    target: 1,
    dayOfWeek: 0,
  },
  {
    id: 'monday_plastic',
    title: 'Recycle 3 Plastic Bottles',
    description: 'Start your week strong by recycling plastic bottles',
    points: 30,
    wasteType: 'plastic',
    target: 3,
    dayOfWeek: 1,
  },
  {
    id: 'tuesday_paper',
    title: 'Sort Paper Recyclables',
    description: 'Sort and recycle 5 paper items today',
    points: 40,
    wasteType: 'paper',
    target: 5,
    dayOfWeek: 2,
  },
  {
    id: 'wednesday_ewaste',
    title: 'Proper E-Waste Disposal',
    description: 'Properly dispose of at least 1 electronic item',
    points: 50,
    wasteType: 'e-waste',
    target: 1,
    dayOfWeek: 3,
  },
  {
    id: 'thursday_organic',
    title: 'Compost Organic Waste',
    description: 'Compost 3 organic waste items today',
    points: 25,
    wasteType: 'organic',
    target: 3,
    dayOfWeek: 4,
  },
  {
    id: 'friday_plasticfree',
    title: 'Plastic-Free Day',
    description: 'Go plastic-free for the entire day',
    points: 60,
    wasteType: 'plastic',
    target: 0,
    dayOfWeek: 5,
  },
  {
    id: 'saturday_cleanup',
    title: 'Community Clean-Up',
    description: 'Participate in or organize a local community clean-up',
    points: 80,
    wasteType: 'general',
    target: 1,
    dayOfWeek: 6,
  },
] as const;

// Daily challenge types
export const DAILY_CHALLENGE_TYPES = [
  {
    id: 'recycle_plastic',
    title: 'Plastic Patrol',
    description: 'Recycle 5 plastic items today',
    points: 100,
    wasteType: 'plastic',
    quantity: 5,
  },
  {
    id: 'paper_power',
    title: 'Paper Power',
    description: 'Recycle 10 paper items today',
    points: 80,
    wasteType: 'paper',
    quantity: 10,
  },
  {
    id: 'e_waste_eliminator',
    title: 'E-Waste Eliminator',
    description: 'Recycle 2 electronic items today',
    points: 150,
    wasteType: 'e-waste',
    quantity: 2,
  },
  {
    id: 'organic_optimizer',
    title: 'Organic Optimizer',
    description: 'Compost 5 organic items today',
    points: 50,
    wasteType: 'organic',
    quantity: 5,
  },
] as const;

// Community challenge types
export const COMMUNITY_CHALLENGE_TYPES = [
  {
    id: 'plastic_free_week',
    title: 'Plastic-Free Week',
    description: 'Go plastic-free for 7 days',
    duration: 7,
    points: 500,
    requirements: {
      wasteTypes: ['plastic'],
      actions: 0,
    },
  },
  {
    id: 'recycling_marathon',
    title: 'Recycling Marathon',
    description: 'Recycle 100 items in 30 days',
    duration: 30,
    points: 1000,
    requirements: {
      actions: 100,
    },
  },
  {
    id: 'eco_education',
    title: 'Eco Education',
    description: 'Complete 5 lessons in 7 days',
    duration: 7,
    points: 300,
    requirements: {
      lessons: 5,
    },
  },
] as const;
