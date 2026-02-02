/**
 * Mobile-specific 3D configuration
 * Device-specific quality settings and battery optimization
 */

export interface Mobile3DConfig {
  performance: {
    high: {
      quality: 'high';
      maxPolygons: number;
      textureSize: number;
      enableShadows: boolean;
    };
    medium: {
      quality: 'medium';
      maxPolygons: number;
      textureSize: number;
      enableShadows: boolean;
    };
    low: {
      quality: 'low';
      maxPolygons: number;
      textureSize: number;
      enableShadows: boolean;
    };
  };
  battery: {
    lowBatteryThreshold: number; // percentage
    thermalThrottleThreshold: number; // temperature level
    autoReduceQuality: boolean;
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
  };
}

export const mobile3DConfig: Mobile3DConfig = {
  performance: {
    high: {
      quality: 'high',
      maxPolygons: 50000,
      textureSize: 1024,
      enableShadows: true,
    },
    medium: {
      quality: 'medium',
      maxPolygons: 25000,
      textureSize: 512,
      enableShadows: false,
    },
    low: {
      quality: 'low',
      maxPolygons: 10000,
      textureSize: 256,
      enableShadows: false,
    },
  },
  battery: {
    lowBatteryThreshold: 20, // 20%
    thermalThrottleThreshold: 0.7, // 70% of max temperature
    autoReduceQuality: true,
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
  },
};

