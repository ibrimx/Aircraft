import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'
import { cssTransition } from '@brimair/design-tokens'
import type { CmsSyncStatus } from '@brimair/shared-types'

export type SyncStatusProps = {
  syncStatus: CmsSyncStatus
  onRetry?: () => void
  onDismissErrors?: () => void
  compact?: boolean
  className?: string
  style?: CSSProperties
}

export function SyncStatus({
  syncStatus,
  onRetry,
  onDismissErrors,
  compact = false,
  className,
  style,
}: SyncStatusProps) {
  const theme = useThemeTokens()

  const statusConfig = useMemo(() => {
    switch (syncStatus.status) {
      case 'idle':
        return {
          color: theme.colors.text.secondary,
          label: 'Idle',
          icon: '\u23f8',
        }
      case 'syncing':
        return {
          color: theme.colors.warning.default,
          label: 'Syncing\u2026',
          icon: '\u21bb',
        }
      case 'success':
        return {
          color: theme.colors.success.default,
          label: 'Synced',
          icon: '\u2713',
        }
      case 'error':
        return {
          color: theme.colors.destructive.default,
          label: 'Error',
          icon: '\u2717',
        }
    }
  }, [syncStatus.status, theme])

  if (compact) {
    return (
      <div
        className={className}
        style=
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme.spacing[1],
          fontFamily: theme.fontFamily.sans,
          ...style,
        
      >
        <span
          style=
            width: '8px',
            height: '8px',
            borderRadius: theme.radius.pill,
            background: statusConfig.color,
            flexShrink: 0,
          
        />
        <span
          style=
            fontSize: theme.textStyles.caption.fontSize,
            color: theme.colors.text.secondary,
          
        >
          {statusConfig.label}
        </span>
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacingAlias.sm,
        paddingBlock: theme.spacingAlias.md,
        paddingInline: theme.spacingAlias.md,
        background: theme.colors.surface.default,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border.subtle}`,
        fontFamily: theme.fontFamily.sans,
        ...style,
      }}
    >
      {/* Status header */}
      <div style= display: 'flex', alignItems: 'center', gap: theme.spacing[2] >
        <span
          style=
            width: '10px',
            height: '10px',
            borderRadius: theme.radius.pill,
            background: statusConfig.color,
            flexShrink: 0,
          
        />
        <span
          style=
            fontSize: theme.textStyles.body.fontSize,
            fontWeight: theme.textStyles.bodyBold.fontWeight,
            color: theme.colors.text.primary,
          
        >
          {statusConfig.icon} {statusConfig.label}
        </span>
      </div>

      {/* Stats */}
      <div
        style=
          display: 'flex',
          gap: theme.spacingAlias.lg,
          fontSize: theme.textStyles.caption.fontSize,
          color: theme.colors.text.secondary,
        
      >
        <span>Records synced: {syncStatus.recordsSynced}</span>
        {syncStatus.lastSync && (
          <span>
            Last: {new Date(syncStatus.lastSync).toLocaleString()}
          </span>
        )}
        {syncStatus.nextSync && (
          <span>
            Next: {new Date(syncStatus.nextSync).toLocaleString()}
          </span>
        )}
      </div>

      {/* Errors */}
      {syncStatus.errors.length > 0 && (
        <div
          style=
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing[1],
            paddingBlock: theme.spacingAlias.sm,
            paddingInline: theme.spacingAlias.sm,
            background: theme.colors.destructive.subtle,
            borderRadius: theme.radius.md,
          
        >
          <div
            style=
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            
          >
            <span
              style=
                fontSize: theme.textStyles.caption.fontSize,
                fontWeight: theme.textStyles.bodyBold.fontWeight,
                color: theme.colors.destructive.default,
              
            >
              {syncStatus.errors.length} error{syncStatus.errors.length > 1 ? 's' : ''}
            </span>
            {onDismissErrors && (
              <button
                type="button"
                onClick={onDismissErrors}
                style=
                  background: 'transparent',
                  border: 'none',
                  color: theme.colors.text.secondary,
                  fontSize: theme.textStyles.caption.fontSize,
                  cursor: 'pointer',
                  fontFamily: theme.fontFamily.sans,
                  paddingInline: theme.spacing[2],
                
              >
                Dismiss
              </button>
            )}
          </div>
          {syncStatus.errors.slice(0, 5).map((err, i) => (
            <span
              key={i}
              style=
                fontSize: theme.textStyles.caption.fontSize,
                color: theme.colors.destructive.default,
                fontFamily: theme.fontFamily.mono,
              
            >
              {err}
            </span>
          ))}
          {syncStatus.errors.length > 5 && (
            <span
              style=
                fontSize: theme.textStyles.caption.fontSize,
                color: theme.colors.text.tertiary,
              
            >
              +{syncStatus.errors.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      {syncStatus.status === 'error' && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style=
            height: '36px',
            paddingInline: theme.spacingAlias.md,
            background: theme.colors.accent.default,
            color: theme.colors.text.inverse,
            border: 'none',
            borderRadius: theme.radius.md,
            fontSize: theme.textStyles.body.fontSize,
            fontFamily: theme.fontFamily.sans,
            cursor: 'pointer',
            transition: cssTransition('background', 'normal', 'easeInOut'),
            alignSelf: 'flex-start',
          
        >
          Retry Sync
        </button>
      )}
    </div>
  )
}
