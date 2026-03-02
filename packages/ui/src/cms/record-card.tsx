import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens, cssTransition } from '@aircraft/design-tokens'
import type { CmsRecord, CmsFieldSchema, CmsFieldValue } from '@aircraft/shared-types'

export type RecordCardProps = {
  record: CmsRecord
  schema: CmsFieldSchema[]
  titleField?: string
  selected?: boolean
  onClick?: (record: CmsRecord) => void
  className?: string
  style?: CSSProperties
}

export function RecordCard({
  record,
  schema,
  titleField,
  selected = false,
  onClick,
  className,
  style,
}: RecordCardProps) {
  const theme = useThemeTokens()

  const title = useMemo(() => {
    if (titleField && record.fields[titleField]) {
      return formatFieldValue(record.fields[titleField])
    }
    const first = schema[0]
    if (first && record.fields[first.name]) {
      return formatFieldValue(record.fields[first.name])
    }
    return record.externalId
  }, [record, schema, titleField])

  const previewFields = useMemo(() => {
    return schema
      .filter((f) => f.name !== titleField)
      .slice(0, 3)
      .map((f) => ({
        name: f.name,
        type: f.type,
        value: formatFieldValue(record.fields[f.name] ?? null),
      }))
  }, [record, schema, titleField])

  return (
    <button
      type="button"
      className={className}
      onClick={() => onClick?.(record)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[2],
        paddingBlock: theme.spacingAlias.sm,
        paddingInline: theme.spacingAlias.md,
        minHeight: '44px',
        background: selected
          ? theme.colors.accent.subtle
          : theme.colors.surface.default,
        border: `1px solid ${
          selected ? theme.colors.accent.default : theme.colors.border.subtle
        }`,
        borderRadius: theme.radius.md,
        cursor: onClick ? 'pointer' : 'default',
        outline: 'none',
        textAlign: 'start' as const,
        fontFamily: theme.fontFamily.sans,
        width: '100%',
        transition: cssTransition('background', 'fast', 'easeInOut'),
        ...style,
      }}
    >
      {/* Title */}
      <span
        style={{
          fontSize: theme.textStyles.body.fontSize,
          fontWeight: theme.textStyles.bodyBold.fontWeight,
          color: theme.colors.text.primary,
          lineHeight: theme.textStyles.body.lineHeight,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}
      >
        {title}
      </span>

      {/* Preview fields */}
      {previewFields.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}>
          {previewFields.map((f) => (
            <div
              key={f.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                fontSize: theme.textStyles.caption.fontSize,
                lineHeight: theme.textStyles.caption.lineHeight,
              }}
            >
              <span style={{ color: theme.colors.text.tertiary, flexShrink: 0 }}>
                {f.name}
              </span>
              <span
                style={{
                  color: theme.colors.text.secondary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.value || '\u2014'}
              </span>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}

function formatFieldValue(value: CmsFieldValue): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return value.join(', ')
  if ('type' in value) {
    switch (value.type) {
      case 'richtext': return value.nodes.map((n) => n.type === 'text' ? (n.content ?? '') : '').join('')
      case 'relation': return `${value.recordIds.length} linked`
      case 'image': return value.alt ?? value.url
      case 'file': return value.name
    }
  }
  return ''
}
