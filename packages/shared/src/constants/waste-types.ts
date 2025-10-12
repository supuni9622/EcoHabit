export const WASTE_TYPES = {
  PLASTIC: 'plastic',
  PAPER: 'paper',
  E_WASTE: 'e-waste',
  ORGANIC: 'organic',
  GLASS: 'glass',
  METAL: 'metal',
  TEXTILE: 'textile',
  OTHER: 'other',
} as const;

export const WASTE_TYPE_LABELS = {
  [WASTE_TYPES.PLASTIC]: 'Plastic',
  [WASTE_TYPES.PAPER]: 'Paper',
  [WASTE_TYPES.E_WASTE]: 'E-Waste',
  [WASTE_TYPES.ORGANIC]: 'Organic',
  [WASTE_TYPES.GLASS]: 'Glass',
  [WASTE_TYPES.METAL]: 'Metal',
  [WASTE_TYPES.TEXTILE]: 'Textile',
  [WASTE_TYPES.OTHER]: 'Other',
} as const;

export const WASTE_TYPE_ICONS = {
  [WASTE_TYPES.PLASTIC]: '🥤',
  [WASTE_TYPES.PAPER]: '📄',
  [WASTE_TYPES.E_WASTE]: '💻',
  [WASTE_TYPES.ORGANIC]: '🍎',
  [WASTE_TYPES.GLASS]: '🍶',
  [WASTE_TYPES.METAL]: '🥫',
  [WASTE_TYPES.TEXTILE]: '👕',
  [WASTE_TYPES.OTHER]: '🗑️',
} as const;

export const WASTE_TYPE_COLORS = {
  [WASTE_TYPES.PLASTIC]: '#3B82F6',
  [WASTE_TYPES.PAPER]: '#10B981',
  [WASTE_TYPES.E_WASTE]: '#8B5CF6',
  [WASTE_TYPES.ORGANIC]: '#F59E0B',
  [WASTE_TYPES.GLASS]: '#06B6D4',
  [WASTE_TYPES.METAL]: '#6B7280',
  [WASTE_TYPES.TEXTILE]: '#EC4899',
  [WASTE_TYPES.OTHER]: '#9CA3AF',
} as const;

export const WASTE_TYPE_DESCRIPTIONS = {
  [WASTE_TYPES.PLASTIC]: 'Plastic bottles, bags, containers, and packaging',
  [WASTE_TYPES.PAPER]: 'Newspapers, magazines, cardboard, and office paper',
  [WASTE_TYPES.E_WASTE]: 'Electronic devices, batteries, and electrical equipment',
  [WASTE_TYPES.ORGANIC]: 'Food scraps, yard waste, and compostable materials',
  [WASTE_TYPES.GLASS]: 'Glass bottles, jars, and containers',
  [WASTE_TYPES.METAL]: 'Aluminum cans, steel containers, and metal items',
  [WASTE_TYPES.TEXTILE]: 'Clothing, fabrics, and textile materials',
  [WASTE_TYPES.OTHER]: 'Other recyclable materials not listed above',
} as const;

export const WASTE_TYPE_CATEGORIES = {
  RECYCLABLE: 'recyclable',
  COMPOSTABLE: 'compostable',
  HAZARDOUS: 'hazardous',
  GENERAL: 'general',
} as const;

export const WASTE_TYPE_CATEGORY_MAPPING = {
  [WASTE_TYPES.PLASTIC]: WASTE_TYPE_CATEGORIES.RECYCLABLE,
  [WASTE_TYPES.PAPER]: WASTE_TYPE_CATEGORIES.RECYCLABLE,
  [WASTE_TYPES.E_WASTE]: WASTE_TYPE_CATEGORIES.HAZARDOUS,
  [WASTE_TYPES.ORGANIC]: WASTE_TYPE_CATEGORIES.COMPOSTABLE,
  [WASTE_TYPES.GLASS]: WASTE_TYPE_CATEGORIES.RECYCLABLE,
  [WASTE_TYPES.METAL]: WASTE_TYPE_CATEGORIES.RECYCLABLE,
  [WASTE_TYPES.TEXTILE]: WASTE_TYPE_CATEGORIES.RECYCLABLE,
  [WASTE_TYPES.OTHER]: WASTE_TYPE_CATEGORIES.GENERAL,
} as const;

export const WASTE_TYPE_POINTS = {
  [WASTE_TYPES.PLASTIC]: 10,
  [WASTE_TYPES.PAPER]: 8,
  [WASTE_TYPES.E_WASTE]: 15,
  [WASTE_TYPES.ORGANIC]: 5,
  [WASTE_TYPES.GLASS]: 12,
  [WASTE_TYPES.METAL]: 14,
  [WASTE_TYPES.TEXTILE]: 6,
  [WASTE_TYPES.OTHER]: 3,
} as const;

export const WASTE_TYPE_IMPACT_FACTORS = {
  [WASTE_TYPES.PLASTIC]: {
    co2PerKg: 2.5,
    waterPerItem: 0.5,
    wildlifePerItem: 0.1,
    treesPerItem: 0.05,
  },
  [WASTE_TYPES.PAPER]: {
    co2PerKg: 1.2,
    waterPerItem: 0.3,
    wildlifePerItem: 0.05,
    treesPerItem: 0.1,
  },
  [WASTE_TYPES.E_WASTE]: {
    co2PerKg: 5.0,
    waterPerItem: 1.0,
    wildlifePerItem: 0.2,
    treesPerItem: 0.15,
  },
  [WASTE_TYPES.ORGANIC]: {
    co2PerKg: 0.8,
    waterPerItem: 0.2,
    wildlifePerItem: 0.02,
    treesPerItem: 0.03,
  },
  [WASTE_TYPES.GLASS]: {
    co2PerKg: 1.5,
    waterPerItem: 0.4,
    wildlifePerItem: 0.08,
    treesPerItem: 0.07,
  },
  [WASTE_TYPES.METAL]: {
    co2PerKg: 3.0,
    waterPerItem: 0.6,
    wildlifePerItem: 0.12,
    treesPerItem: 0.1,
  },
  [WASTE_TYPES.TEXTILE]: {
    co2PerKg: 1.8,
    waterPerItem: 0.3,
    wildlifePerItem: 0.06,
    treesPerItem: 0.04,
  },
  [WASTE_TYPES.OTHER]: {
    co2PerKg: 1.0,
    waterPerItem: 0.2,
    wildlifePerItem: 0.03,
    treesPerItem: 0.02,
  },
} as const;

export const WASTE_TYPE_DISPOSAL_METHODS = {
  [WASTE_TYPES.PLASTIC]: ['recycling_center', 'curbside_pickup', 'drop_off'],
  [WASTE_TYPES.PAPER]: ['recycling_center', 'curbside_pickup', 'drop_off'],
  [WASTE_TYPES.E_WASTE]: ['e_waste_center', 'specialized_drop_off', 'retailer_takeback'],
  [WASTE_TYPES.ORGANIC]: ['compost_bin', 'curbside_pickup', 'community_garden'],
  [WASTE_TYPES.GLASS]: ['recycling_center', 'curbside_pickup', 'drop_off'],
  [WASTE_TYPES.METAL]: ['recycling_center', 'curbside_pickup', 'scrap_yard'],
  [WASTE_TYPES.TEXTILE]: ['donation_center', 'textile_recycling', 'drop_off'],
  [WASTE_TYPES.OTHER]: ['recycling_center', 'drop_off', 'specialized_center'],
} as const;

export const WASTE_TYPE_TIPS = {
  [WASTE_TYPES.PLASTIC]: [
    'Rinse containers before recycling',
    'Remove labels and caps',
    'Check local recycling guidelines',
    'Consider reusable alternatives',
  ],
  [WASTE_TYPES.PAPER]: [
    'Keep paper dry and clean',
    'Remove staples and clips',
    'Separate different paper types',
    'Consider digital alternatives',
  ],
  [WASTE_TYPES.E_WASTE]: [
    'Remove personal data before disposal',
    'Check for manufacturer takeback programs',
    'Donate working electronics',
    'Find certified e-waste recyclers',
  ],
  [WASTE_TYPES.ORGANIC]: [
    'Keep compost clean and balanced',
    'Avoid meat and dairy in compost',
    'Turn compost regularly',
    'Use compost in your garden',
  ],
  [WASTE_TYPES.GLASS]: [
    'Remove lids and labels',
    'Rinse containers thoroughly',
    'Check for broken glass',
    'Separate by color if required',
  ],
  [WASTE_TYPES.METAL]: [
    'Remove food residue',
    'Check for magnetic properties',
    'Separate aluminum and steel',
    'Consider metal recycling value',
  ],
  [WASTE_TYPES.TEXTILE]: [
    'Clean and dry before donation',
    'Check for rips and stains',
    'Separate by material type',
    'Consider upcycling options',
  ],
  [WASTE_TYPES.OTHER]: [
    'Check local recycling guidelines',
    'Contact recycling center for guidance',
    'Consider reuse options',
    'Research specialized disposal methods',
  ],
} as const;
