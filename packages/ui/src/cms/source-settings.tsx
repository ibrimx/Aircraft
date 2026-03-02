import { useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens, cssTransition } from '@aircraft/design-tokens'
import type { CmsSource, CmsSourceStatus } from '@aircraft/shared-types'

export type SourceSettingsProps = {
  source: CmsSource
  onSave: (updates: Partial<Pick<CmsSource, 'name' | 'syncInterval' | 'config'>>) => void
  onSync: () => void
  onDisconnect: () => void
  className?: string
  style?: CSSProperties
}

type SyncOption = { readonly value: number; readonly label: string }

const SYNC_INTERVALS: readonly SyncOption[] = [
  { value: 0, label: 'Manual' },
  { value: 60, label: 'Every minute' },
  { value: 300, label: 'Every 5 min' },
  { value: 900, label: 'Every 15 min' },
  { value: 3600, label: 'Every hour' },
  { value: 86400, label: 'Daily' },
] as const

type ThemeTokens = ReturnType<typeof useThemeTokens>

export function SourceSettings({
  source,
  onSave,
  onSync,
  onDisconnect,
  className,
  style,
}: SourceSettingsProps) {
  const theme = useThemeTokens()
  const [name, setName] = useState(source.name)
  const [syncInterval, setSyncInterval] = useState(source.syncInterval)

  const handleSave = useCallback(() => {
    onSave({ name, syncInterval })
  }, [name, syncInterval, onSave])

  const statusColor = getStatusColor(source.status, theme)
  const statusLabel = getStatusLabel(source.status)
  const isSyncing = source.status === 'syncing'

  const labelStyle: CSSProperties = {
    fontSize: theme.textStyles.caption.fontSize,
    fontWeight: theme.textStyles.bodyBold.fontWeight,
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.sans,
    marginBlockEnd: theme.spacing[1],
    display: 'block',
  }

  const fieldStyle: CSSProperties = {
    width: '100%',
    height: '40px',
    paddingInline: theme.spacing[3],
    background: theme.colors.surface.sunken,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.radius.md,
    color: theme.colors.text.primary,
    fontSize: theme.textStyles.body.fontSize,
    fontFamily: theme.fontFamily.sans,
    outline: 'none',
    textAlign: 'start' as const,
    transition: cssTransition('border-color', 'normal', 'easeInOut'),
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacingAlias.md,
        paddingBlock: theme.spacingAlias.md,
        paddingInline: theme.spacingAlias.md,
        background: theme.colors.surface.default,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border.subtle}`,
        ...style,
      }}
    >
      {/* Status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: theme.radius.pill,
            background: statusColor,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: theme.textStyles.caption.fontSize,
            fontFamily: theme.fontFamily.sans,
            color: theme.colors.text.secondary,
          }}
        >
          {statusLabel}
        </span>
        {source.lastSync && (
          <span
            style={{
              fontSize: theme.textStyles.caption.fontSize,
              color: theme.colors.text.tertiary,
              marginInlineStart: 'auto',
              fontFamily: theme.fontFamily.sans,
            }}
          >
            Last sync: {new Date(source.lastSync).toLocaleString()}
          </span>
        )}
      </div>

      {/* Source name */}
      <div>
        <label style={labelStyle}>Source Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={fieldStyle}
        />
      </div>

      {/* Sync interval */}
      <div>
        <label style={labelStyle}>Sync Interval</label>
        <select
          value={syncInterval}
          onChange={(e) => setSyncInterval(Number(e.target.value))}
          style={{ ...fieldStyle, cursor: 'pointer' }}
        >
          {SYNC_INTERVALS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error message */}
      {source.lastError && (
        <div
          style={{
            padding: theme.spacingAlias.sm,
            background: theme.colors.destructive.subtle,
            borderRadius: theme.radius.md,
            fontSize: theme.textStyles.caption.fontSize,
            color: theme.colors.destructive.default,
            fontFamily: theme.fontFamily.sans,
          }}
        >
          {source.lastError}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: theme.spacing[2], marginBlockStart: theme.spacing[2] }}>
        <button
          type="button"
          onClick={handleSave}
          style={{
            flex: 1,
            height: '40px',
            background: theme.colors.accent.default,
            color: theme.colors.text.inverse,
            border: 'none',
            borderRadius: theme.radius.md,
            fontSize: theme.textStyles.body.fontSize,
            fontFamily: theme.fontFamily.sans,
            fontWeight: theme.textStyles.bodyBold.fontWeight,
            cursor: 'pointer',
            transition: cssTransition('background', 'normal', 'easeInOut'),
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onSync}
          disabled={isSyncing}
          style={{
            height: '40px',
            paddingInline: theme.spacingAlias.md,
            background: 'transparent',
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.radius.md,
            fontSize: theme.textStyles.body.fontSize,
            fontFamily: theme.fontFamily.sans,
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            opacity: isSyncing ? 0.4 : 1,
            transition: cssTransition('background', 'normal', 'easeInOut'),
          }}
        >
          Sync Now
        </button>
        <button
          type="button"
          onClick={onDisconnect}
          style={{
            height: '40px',
            paddingInline: theme.spacingAlias.md,
            background: 'transparent',
            color: theme.colors.destructive.default,
            border: `1px solid ${theme.colors.destructive.default}`,
            borderRadius: theme.radius.md,
            fontSize: theme.textStyles.body.fontSize,
            fontFamily: theme.fontFamily.sans,
            cursor: 'pointer',
            transition: cssTransition('background', 'normal', 'easeInOut'),
          }}
        >
          Disconnect
        </button>
      </div>
    </div>
  )
}

function getStatusColor(status: CmsSourceStatus, theme: ThemeTokens): string {
  switch (status) {
    case 'connected': return theme.colors.success.default
    case 'syncing': return theme.colors.warning.default
    case 'error': return theme.colors.destructive.default
    case 'disconnected': return theme.colors.text.disabled
  }
}

function getStatusLabel(status: CmsSourceStatus): string {
  switch (status) {
    case 'connected': return 'Connected'
    case 'syncing': return 'Syncing…'
    case 'error': return 'Error'
    case 'disconnected': return 'Disconnected'
  }
}
