/** Memory guard state used to control runtime degradation strategies. */
export type MemoryGuardLevel =
  | 'normal'
  | 'warning'
  | 'aggressive'
  | 'critical'
  | 'emergency'

/**
 * Global hard performance limits enforced across canvas, document, assets, network, and mobile runtime.
 */
export const PERFORMANCE_BUDGET = {
  canvas: {
    maxObjects: 500,
    maxObjectsMobile: 200,
    warningAt: 300,
    warningAtMobile: 150,
    targetFPS: 60,
    targetFPSMobile: 30,
    minAcceptableFPS: 24,
  },
  document: {
    maxSizeKB: 2048,
    maxPatchesBeforeSnapshot: 25,
    maxHistoryDepth: 100,
    maxHistoryDepthMobile: 50,
  },
  assets: {
    maxFileSizeMB: 10,
    maxTotalStorageMB: 500,
    thumbnailSize: 200,
    supportedImageFormats: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'],
    supportedFontFormats: ['woff2', 'woff', 'ttf', 'otf'],
  },
  network: {
    syncIntervalMs: 5000,
    maxRetries: 3,
    timeoutMs: 10000,
    offlineQueueMax: 100,
  },
  mobile: {
    maxTextureMemoryMB: 128,
    warningTextureMemoryMB: 96,
    touchDebounceMs: 16,
    gestureThresholdPx: 8,
    longPressMs: 300,
    fastSwipeVelocity: 500,
    maxMemoryMB: 256,
    warningMemoryMB: 200,
    criticalMemoryMB: 280,
    emergencyMemoryMB: 300,
  },
} as const
