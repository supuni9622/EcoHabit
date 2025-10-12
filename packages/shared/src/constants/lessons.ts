import { Lesson } from '../types';

export const LESSON_DAYS = 25;

export const LESSON_THEMES = {
  PLASTIC: 'plastic',
  PAPER: 'paper',
  E_WASTE: 'e-waste',
  ORGANIC: 'organic',
  GLASS: 'glass',
  METAL: 'metal',
  TEXTILE: 'textile',
  GENERAL: 'general',
} as const;

export const LESSON_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const LESSON_CONTENT = {
  STORY: 'story',
  KEY_MESSAGE: 'keyMessage',
  VISUALS: 'visuals',
  INTERACTIVE: 'interactiveElements',
} as const;

export const LESSON_MICRO_ACTIONS = {
  PHOTO: 'photo',
  LOG_ACTION: 'log_action',
  REFLECTION: 'reflection',
  QUIZ: 'quiz',
  CHALLENGE: 'challenge',
} as const;

export const LESSON_AI_PROMPTS = {
  REFLECTION: 'reflection',
  COACHING: 'coaching',
  ENCOURAGEMENT: 'encouragement',
  CHALLENGE: 'challenge',
} as const;

export const LESSON_MEDIA_TYPES = {
  IMAGES: 'images',
  VIDEOS: 'videos',
  AUDIO: 'audio',
  THREE_D: 'threeD',
} as const;

export const LESSON_PROGRESS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  LOCKED: 'locked',
} as const;

export const LESSON_REWARDS = {
  POINTS: 'points',
  BADGES: 'badges',
  FEATURES: 'features',
  TITLE: 'title',
} as const;

export const LESSON_CATEGORIES = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;

export const LESSON_TAGS = {
  PLASTIC_POLLUTION: 'plastic_pollution',
  CLIMATE_CHANGE: 'climate_change',
  WILDLIFE_CONSERVATION: 'wildlife_conservation',
  OCEAN_CLEANUP: 'ocean_cleanup',
  SUSTAINABLE_LIVING: 'sustainable_living',
  RECYCLING: 'recycling',
  COMPOSTING: 'composting',
  ENERGY_CONSERVATION: 'energy_conservation',
  WATER_CONSERVATION: 'water_conservation',
  AIR_QUALITY: 'air_quality',
} as const;

export const LESSON_DURATION = {
  SHORT: 5, // 5 minutes
  MEDIUM: 10, // 10 minutes
  LONG: 15, // 15 minutes
} as const;

export const LESSON_POINTS = {
  COMPLETION: 50,
  QUIZ_CORRECT: 25,
  REFLECTION: 25,
  MICRO_ACTION: 50,
} as const;

export const LESSON_BADGES = {
  FIRST_LESSON: 'first_lesson',
  LESSON_LEARNER: 'lesson_learner',
  KNOWLEDGE_KEEPER: 'knowledge_keeper',
  ECO_SCHOLAR: 'eco_scholar',
} as const;

export const LESSON_FEATURES = {
  BASIC_AVATAR: 'basic_avatar',
  SCHOLAR_ACCESSORY: 'scholar_accessory',
  WISE_AVATAR: 'wise_avatar',
  SPECIAL_ANIMATIONS: 'special_animations',
} as const;

export const LESSON_TITLES = {
  FIRST_LESSON: 'First Lesson',
  LESSON_LEARNER: 'Lesson Learner',
  KNOWLEDGE_KEEPER: 'Knowledge Keeper',
  ECO_SCHOLAR: 'Eco Scholar',
} as const;
