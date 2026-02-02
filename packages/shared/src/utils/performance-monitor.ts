/**
 * Performance monitoring utilities
 * Tracks FPS, memory usage, and render times
 */

export interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  renderTime: number;
  frameCount: number;
}

export interface PerformanceMonitorOptions {
  sampleSize?: number;
  updateInterval?: number;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private renderTimes: number[] = [];
  private sampleSize: number;
  private updateInterval: number;
  private onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  private rafId?: number;
  private intervalId?: NodeJS.Timeout;

  constructor(options: PerformanceMonitorOptions = {}) {
    this.sampleSize = options.sampleSize || 60;
    this.updateInterval = options.updateInterval || 1000;
    this.onMetricsUpdate = options.onMetricsUpdate;
  }

  /**
   * Start monitoring performance
   */
  start(): void {
    if (typeof window === 'undefined') return;

    this.lastTime = performance.now();
    this.frameCount = 0;
    this.renderTimes = [];

    const measure = (currentTime: number) => {
      const delta = currentTime - this.lastTime;
      this.frameCount++;

      if (delta >= 1000) {
        this.fps = (this.frameCount * 1000) / delta;
        this.frameCount = 0;
        this.lastTime = currentTime;

        // Calculate average render time
        const avgRenderTime =
          this.renderTimes.length > 0
            ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
            : 0;

        // Get memory usage if available
        const memoryUsage = this.getMemoryUsage();

        const metrics: PerformanceMetrics = {
          fps: this.fps,
          memoryUsage,
          renderTime: avgRenderTime,
          frameCount: this.frameCount,
        };

        if (this.onMetricsUpdate) {
          this.onMetricsUpdate(metrics);
        }

        this.renderTimes = [];
      }

      this.rafId = requestAnimationFrame(measure);
    };

    this.rafId = requestAnimationFrame(measure);

    // Periodic updates
    this.intervalId = setInterval(() => {
      const memoryUsage = this.getMemoryUsage();
      const avgRenderTime =
        this.renderTimes.length > 0
          ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
          : 0;

      if (this.onMetricsUpdate) {
        this.onMetricsUpdate({
          fps: this.fps,
          memoryUsage,
          renderTime: avgRenderTime,
          frameCount: this.frameCount,
        });
      }
    }, this.updateInterval);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  /**
   * Record render time
   */
  recordRenderTime(time: number): void {
    this.renderTimes.push(time);
    if (this.renderTimes.length > this.sampleSize) {
      this.renderTimes.shift();
    }
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Get memory usage (if available)
   */
  private getMemoryUsage(): number | undefined {
    if (typeof window === 'undefined') return undefined;

    const performance = window.performance as any;
    if (performance.memory) {
      return performance.memory.usedJSHeapSize / 1048576; // Convert to MB
    }
    return undefined;
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    const avgRenderTime =
      this.renderTimes.length > 0
        ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
        : 0;

    return {
      fps: this.fps,
      memoryUsage: this.getMemoryUsage(),
      renderTime: avgRenderTime,
      frameCount: this.frameCount,
    };
  }
}

/**
 * Create a new performance monitor instance
 */
export const createPerformanceMonitor = (
  options?: PerformanceMonitorOptions
): PerformanceMonitor => {
  return new PerformanceMonitor(options);
};

/**
 * Global performance monitor instance
 */
let globalMonitor: PerformanceMonitor | null = null;

/**
 * Get or create global performance monitor
 */
export const getPerformanceMonitor = (): PerformanceMonitor => {
  if (!globalMonitor) {
    globalMonitor = createPerformanceMonitor();
  }
  return globalMonitor;
};

