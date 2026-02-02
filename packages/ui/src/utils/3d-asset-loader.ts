/**
 * 3D Asset Loader utility
 * Centralized asset loading with progress tracking and cache management
 */

export interface AssetLoadProgress {
  loaded: number;
  total: number;
  percentage: number;
  currentAsset?: string;
}

export type AssetLoadCallback = (progress: AssetLoadProgress) => void;

class AssetLoader {
  private cache: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  /**
   * Load a 3D model (GLTF/GLB)
   */
  async loadModel(
    path: string,
    onProgress?: AssetLoadCallback
  ): Promise<any> {
    // Check cache first
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    // Check if already loading
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path);
    }

    // Start loading
    const loadPromise = this.loadModelInternal(path, onProgress);
    this.loadingPromises.set(path, loadPromise);

    try {
      const result = await loadPromise;
      this.cache.set(path, result);
      return result;
    } catch (error) {
      this.loadingPromises.delete(path);
      throw error;
    } finally {
      this.loadingPromises.delete(path);
    }
  }

  private async loadModelInternal(
    path: string,
    onProgress?: AssetLoadCallback
  ): Promise<any> {
    if (typeof window === 'undefined') {
      throw new Error('Asset loading is only available in browser environment');
    }

    // Dynamic import of GLTFLoader
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
      loader.load(
        path,
        (gltf) => {
          if (onProgress) {
            onProgress({
              loaded: 1,
              total: 1,
              percentage: 100,
              currentAsset: path,
            });
          }
          resolve(gltf);
        },
        (progress) => {
          if (onProgress && progress.total > 0) {
            onProgress({
              loaded: progress.loaded,
              total: progress.total,
              percentage: (progress.loaded / progress.total) * 100,
              currentAsset: path,
            });
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Preload multiple assets
   */
  async preloadAssets(
    paths: string[],
    onProgress?: AssetLoadCallback
  ): Promise<void> {
    const total = paths.length;
    let loaded = 0;

    const promises = paths.map(async (path) => {
      try {
        await this.loadModel(path, (progress) => {
          if (onProgress) {
            onProgress({
              loaded: loaded + (progress.percentage / 100),
              total,
              percentage: ((loaded + progress.percentage / 100) / total) * 100,
              currentAsset: path,
            });
          }
        });
        loaded++;
      } catch (error) {
        console.warn(`Failed to load asset: ${path}`, error);
        loaded++;
      }
    });

    await Promise.all(promises);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Remove specific asset from cache
   */
  removeFromCache(path: string): void {
    this.cache.delete(path);
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const assetLoader = new AssetLoader();

