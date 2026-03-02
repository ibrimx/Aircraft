import { useCallback } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { cssTransition } from '@aircraft/design-tokens'
import type { CmsSourceType } from '@aircraft/shared-types'

export type SourcePickerProps = {
  onSelect: (type: CmsSourceType) => void
  selected?: CmsSourceType
  disabled?: boolean
  className?: string
  style?: CSSProperties
}

type SourceOption = { type: CmsSourceType; label: string; icon: string }

const SOURCE_OPTIONS: readonly SourceOption[] = [
  { type: 'notion', label: 'Notion', icon: '📝' },
  { type: 'airtable', label: 'Airtable', icon: '📊' },
  { type: 'sheets', label: 'Google Sheets', icon: '📗' },
  { type: 'supabase', label: 'Supabase', icon: '⚡' },
  { type: 'markdown', label: 'Markdown', icon: '📄' },
  { type: 'json', label: 'JSON', icon: '🔧' },
  { type: 'rest', label: 'REST API', icon: '🌐' },
] as const

export function SourcePicker({
  onSelect,
  selected,
  disabled = false,
  className,
  style,
}: SourcePickerProps) {
  const theme = useThemeTokens()

  const handleSelect = useCallback(
    (type: CmsSourceType) => {
      if (!disabled) onSelect(type)
    },
    [disabled, onSelect],
  )

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: theme.spacing[3],
    ...style,
  }

  const iconStyle: CSSProperties = { fontSize: '24px', lineHeight: 1 }

  const labelStyle = (isSelected: boolean): CSSProperties => ({
    fontSize: theme.textStyles.caption.fontSize,
    fontWeight: isSelected
      ? theme.textStyles.bodyBold.fontWeight
      : theme.textStyles.body.fontWeight,
    color: isSelected
      ? theme.colors.accent.default
      : theme.colors.text.primary,
    lineHeight: theme.textStyles.caption.lineHeight,
  })

  return (
    <div
      className={className}
      role="radiogroup"
      aria-label="Select CMS source type"
      style={gridStyle}
    >
      {SOURCE_OPTIONS.map((source) => {
        const isSelected = selected === source.type
        return (
          <button
            key={source.type}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => handleSelect(source.type)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing[2],
              paddingBlock: theme.spacingAlias.md,
              paddingInline: theme.spacingAlias.sm,
              background: isSelected
                ? theme.colors.accent.subtle
                : theme.colors.surface.default,
              border: `1px solid ${
                isSelected
                  ? theme.colors.accent.default
                  : theme.colors.border.subtle
              }`,
              borderRadius: theme.radius.lg,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.4 : 1,
              outline: 'none',
              transition: cssTransition('background', 'normal', 'easeInOut'),
              fontFamily: theme.fontFamily.sans,
              minHeight: '44px',
            }}
          >
            <span style={iconStyle}>{source.icon}</span>
            <span style={labelStyle(isSelected)}>{source.label}</span>
          </button>
        )
      })}
    </div>
  )
}
