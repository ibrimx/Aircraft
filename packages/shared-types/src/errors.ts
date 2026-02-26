import type { ISODateString } from './common'

/** Error severity indicating expected impact and handling strategy. */
export type ErrorSeverity = 'recoverable' | 'fatal' | 'silent'

/** Top-level category for grouping Brimair system errors. */
export type ErrorCategory =
  | 'patch'
  | 'document'
  | 'canvas'
  | 'network'
  | 'auth'
  | 'permission'
  | 'cms'
  | 'storage'
  | 'publish'
  | 'system'

/** Suggested recovery action that UI or services can apply after an error. */
export type RecoveryAction =
  | 'retry'
  | 'reload'
  | 'revert'
  | 'login'
  | 'cleanup'
  | 'ignore'
  | 'contact-support'

/**
 * Canonical error object used across Brimair packages and applications.
 */
export type BrimairError = {
  code: string
  category: ErrorCategory
  severity: ErrorSeverity
  message: string
  userMessage: string | null
  context: Record<string, unknown>
  timestamp: ISODateString
  recoveryAction: RecoveryAction | null
}

/** Predefined error codes shared across the platform. */
export const ERROR_CODES = {
  PATCH_INVALID: 'patch/invalid',
  PATCH_CONFLICT: 'patch/conflict',
  PATCH_DUPLICATE: 'patch/duplicate',
  DOCUMENT_NOT_FOUND: 'document/not-found',
  DOCUMENT_CORRUPT: 'document/corrupt',
  DOCUMENT_VERSION_MISMATCH: 'document/version-mismatch',
  CANVAS_LOAD_FAILED: 'canvas/load-failed',
  CANVAS_MEMORY_EXCEEDED: 'canvas/memory-exceeded',
  NETWORK_OFFLINE: 'network/offline',
  NETWORK_TIMEOUT: 'network/timeout',
  AUTH_EXPIRED: 'auth/expired',
  AUTH_INVALID_TOKEN: 'auth/invalid-token',
  PERMISSION_DENIED: 'permission/denied',
  CMS_CONNECTION_FAILED: 'cms/connection-failed',
  CMS_RATE_LIMITED: 'cms/rate-limited',
  CMS_SCHEMA_CHANGED: 'cms/schema-changed',
  STORAGE_FULL: 'storage/full',
  STORAGE_UPLOAD_FAILED: 'storage/upload-failed',
  PUBLISH_FAILED: 'publish/failed',
} as const

/**
 * Creates a normalized BrimairError with defaults derived from severity/category.
 */
export function createError(
  code: string,
  category: ErrorCategory,
  severity: ErrorSeverity,
  message: string,
  context: Record<string, unknown> = {}
): BrimairError {
  const recoveryAction: RecoveryAction | null =
    severity === 'silent'
      ? 'ignore'
      : category === 'network'
        ? 'retry'
        : category === 'auth'
          ? 'login'
          : category === 'patch'
            ? 'revert'
            : category === 'storage'
              ? 'cleanup'
              : severity === 'fatal'
                ? 'reload'
                : null

  return {
    code,
    category,
    severity,
    message,
    userMessage: severity === 'silent' ? null : message,
    context,
    timestamp: new Date().toISOString() as ISODateString,
    recoveryAction,
  }
}
