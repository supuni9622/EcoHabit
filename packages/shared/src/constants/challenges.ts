import { Challenge } from '../types';

export const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'daily_plastic_patrol',
    title: 'Plastic Patrol',
    description: 'Recycle 5 plastic items today',
    type: 'daily',
    requirements: {
      actions: 5,
      wasteTypes: ['plastic'],
      points: 0,
      streak: 0,
    },
    rewards: {
      points: 100,
      badges: [],
      features: ['daily_bonus'],
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
  {
    id: 'daily_paper_power',
    title: 'Paper Power',
    description: 'Recycle 10 paper items today',
    type: 'daily',
    requirements: {
      actions: 10,
      wasteTypes: ['paper'],
      points: 0,
      streak: 0,
    },
    rewards: {
      points: 80,
      badges: [],
      features: ['daily_bonus'],
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
  {
    id: 'daily_e_waste_eliminator',
    title: 'E-Waste Eliminator',
    description: 'Recycle 2 electronic items today',
    type: 'daily',
    requirements: {
      actions: 2,
      wasteTypes: ['e-waste'],
      points: 0,
      streak: 0,
    },
    rewards: {
      points: 150,
      badges: [],
      features: ['daily_bonus'],
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
  {
    id: 'daily_organic_optimizer',
    title: 'Organic Optimizer',
    description: 'Compost 5 organic items today',
    type: 'daily',
    requirements: {
      actions: 5,
      wasteTypes: ['organic'],
      points: 0,
      streak: 0,
    },
    rewards: {
      points: 50,
      badges: [],
      features: ['daily_bonus'],
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
];

export const WEEKLY_CHALLENGE_TEMPLATES: Challenge[] = [
  {
    id: 'weekly_recycling_marathon',
    title: 'Recycling Marathon',
    description: 'Recycle 50 items this week',
    type: 'weekly',
    requirements: {
      actions: 50,
      wasteTypes: ['plastic', 'paper', 'e-waste', 'organic'],
      points: 0,
      streak: 0,
    },
    rewards: {
      points: 500,
      badges: ['weekly_warrior'],
      features: ['weekly_bonus'],
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
  {
    id: 'weekly_plastic_free',
    title: 'Plastic-Free Week',
    description: 'Avoid plastic for 7 days',
    type: 'weekly',
    requirements: {
      actions: 0,
      wasteTypes: ['plastic'],
      points: 0,
      streak: 7,
    },
    rewards: {
      points: 300,
      badges: ['plastic_free_warrior'],
      features: ['plastic_free_bonus'],
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
  {
    id: 'weekly_lesson_learner',
    title: 'Lesson Learner',
    description: 'Complete 3 lessons this week',
    type: 'weekly',
    requirements: {
      actions: 3,
      wasteTypes: ['lesson'],
      points: 0,
      streak: 0,
    },
    rewards: {
      points: 200,
      badges: ['lesson_learner'],
      features: ['lesson_bonus'],
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
];

export const COMMUNITY_CHALLENGES: Challenge[] = [
  {
    id: 'community_earth_day',
    title: 'Earth Day Challenge',
    description: 'Join the community in celebrating Earth Day',
    type: 'community',
    requirements: {
      actions: 10,
      wasteTypes: ['plastic', 'paper', 'e-waste', 'organic'],
      points: 100,
      streak: 0,
    },
    rewards: {
      points: 1000,
      badges: ['earth_day_champion'],
      features: ['community_bonus', 'special_avatar'],
      title: 'Earth Day Champion',
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
  {
    id: 'community_plastic_free_month',
    title: 'Plastic-Free Month',
    description: 'Join the community in going plastic-free for a month',
    type: 'community',
    requirements: {
      actions: 0,
      wasteTypes: ['plastic'],
      points: 0,
      streak: 30,
    },
    rewards: {
      points: 2000,
      badges: ['plastic_free_legend'],
      features: ['legendary_avatar', 'special_title'],
      title: 'Plastic-Free Legend',
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
  {
    id: 'community_recycling_goal',
    title: 'Community Recycling Goal',
    description: 'Help the community reach 10,000 recycled items',
    type: 'community',
    requirements: {
      actions: 20,
      wasteTypes: ['plastic', 'paper', 'e-waste', 'organic'],
      points: 200,
      streak: 0,
    },
    rewards: {
      points: 500,
      badges: ['community_hero'],
      features: ['community_bonus'],
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
];

export const SPECIAL_CHALLENGES: Challenge[] = [
  {
    id: 'special_new_year',
    title: 'New Year Eco Resolution',
    description: 'Start the year with a 30-day eco-streak',
    type: 'special',
    requirements: {
      actions: 30,
      wasteTypes: ['plastic', 'paper', 'e-waste', 'organic'],
      points: 500,
      streak: 30,
    },
    rewards: {
      points: 2000,
      badges: ['new_year_champion'],
      features: ['special_avatar', 'yearly_bonus'],
      title: 'New Year Eco Champion',
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
  {
    id: 'special_holiday_eco',
    title: 'Holiday Eco Challenge',
    description: 'Stay eco-friendly during the holidays',
    type: 'special',
    requirements: {
      actions: 15,
      wasteTypes: ['plastic', 'paper', 'e-waste', 'organic'],
      points: 300,
      streak: 15,
    },
    rewards: {
      points: 1000,
      badges: ['holiday_eco_warrior'],
      features: ['holiday_bonus'],
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    participants: [],
    status: 'active',
  },
];

export const CHALLENGE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  COMMUNITY: 'community',
  SPECIAL: 'special',
} as const;

export const CHALLENGE_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
} as const;

export const CHALLENGE_REWARDS = {
  POINTS: 'points',
  BADGES: 'badges',
  FEATURES: 'features',
  TITLE: 'title',
} as const;
