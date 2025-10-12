import { Badge } from '../types';

// Point values for different waste types
export const POINT_VALUES: Record<string, number> = {
  plastic: 10,
  paper: 8,
  'e-waste': 15,
  organic: 5,
  glass: 12,
  metal: 14,
  textile: 6,
  other: 3,
};

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
    icon: '⚔️',
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
] as const;

// Level requirements
export const LEVEL_REQUIREMENTS = [
  { level: 1, points: 0, title: 'Eco Beginner' },
  { level: 2, points: 1000, title: 'Eco Explorer' },
  { level: 3, points: 2500, title: 'Eco Enthusiast' },
  { level: 4, points: 5000, title: 'Eco Warrior' },
  { level: 5, points: 10000, title: 'Eco Champion' },
  { level: 6, points: 20000, title: 'Eco Master' },
  { level: 7, points: 35000, title: 'Eco Legend' },
  { level: 8, points: 50000, title: 'Eco Guardian' },
  { level: 9, points: 75000, title: 'Eco Hero' },
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
      actions: 0, // Zero plastic usage
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
