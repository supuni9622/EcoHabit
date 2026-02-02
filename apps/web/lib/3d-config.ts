/**
 * Web-specific 3D configuration
 * Performance thresholds and asset paths
 */

export interface Web3DConfig {
  performance: {
    high: {
      dpr: number[];
      shadows: boolean;
      antialias: boolean;
      maxLights: number;
    };
    medium: {
      dpr: number[];
      shadows: boolean;
      antialias: boolean;
      maxLights: number;
    };
    low: {
      dpr: number;
      shadows: boolean;
      antialias: boolean;
      maxLights: number;
    };
  };
  assets: {
    avatars: {
      basePath: string;
      models: Record<number, string>;
    };
    trophies: {
      basePath: string;
      models: Record<string, string>;
    };
    environments: {
      basePath: string;
      models: Record<string, string>;
    };
  };
  thresholds: {
    fpsTarget: number;
    fpsWarning: number;
    memoryWarning: number; // MB
    loadTimeout: number; // ms
  };
}

export const web3DConfig: Web3DConfig = {
  performance: {
    high: {
      dpr: [1, 2],
      shadows: true,
      antialias: true,
      maxLights: 4,
    },
    medium: {
      dpr: [1, 1.5],
      shadows: false,
      antialias: true,
      maxLights: 2,
    },
    low: {
      dpr: 1,
      shadows: false,
      antialias: false,
      maxLights: 1,
    },
  },
  assets: {
    avatars: {
      basePath: '/3d-models/avatars',
      models: {
        1: '/3d-models/avatars/seed.glb',
        2: '/3d-models/avatars/sapling.glb',
        3: '/3d-models/avatars/tree.glb',
        4: '/3d-models/avatars/guardian.glb',
      },
    },
    trophies: {
      basePath: '/3d-models/trophies',
      models: {
        common: '/3d-models/trophies/badge-common.glb',
        rare: '/3d-models/trophies/badge-rare.glb',
        legendary: '/3d-models/trophies/badge-legendary.glb',
      },
    },
    environments: {
      basePath: '/3d-models/environments',
      models: {
        trophyRoom: '/3d-models/environments/trophy-room.glb',
      },
    },
  },
  thresholds: {
    fpsTarget: 60,
    fpsWarning: 30,
    memoryWarning: 500, // MB
    loadTimeout: 10000, // 10 seconds
  },
};

