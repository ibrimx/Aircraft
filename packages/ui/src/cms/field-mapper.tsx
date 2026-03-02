import { useCallback } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { cssTransition } from '@aircraft/design-tokens'
import type { CmsFieldSchema, CmsFieldType } from '@aircraft/shared-types'

export type FieldMapping = {
  sourceField: string
  targetProperty: string
}

export type TargetProperty = {
  name: string
  type: string
  label: string
}

export type FieldMapperProps = {
  schema: CmsFieldSchema[]
  targetProperties: TargetProperty[]
  mappings: FieldMapping[]
  onChange: (mappings: FieldMapping[]) => void
  className?: string
  style?: CSSProperties
}

const FIELD_TYPE_ICONS: Record<CmsFieldType, string> = {
  text: 'Aa',
  richtext: '\u00b6',
  number: '#',
  boolean: '\u2713',
  date: '\ud83d\udcc5',
  datetime: '\u23f0',
  image: '\ud83d\uddbc\ufe0f',
  file: '\ud83d\udcc1',
  url: '\ud83d\udd17',
  email: '\u2709',
  phone: '\ud83d\udcde',
  select: '\u25bc',
  multiselect: '\u2611',
  relation: '\u21c4',
  rollup: '\u03a3',
  formula: 'fx',
  person: '\ud83d\udc64',
  location: '\ud83d\udccd',
}

export function FieldMapper({
  schema,
  targetProperties,
  mappings,
  onChange,
  className,
  style,
}: FieldMapperProps) {
  const theme = useThemeTokens()

  const getMapping = useCallback(
    (fieldName: string) => mappings.find((m) => m.sourceField === fieldName),
    [mappings],
  )

  const handleMap = useCallback(
    (sourceField: string, targetProperty: string) => {
      const updated = mappings.filter((m) => m.sourceField !== sourceField)
      if (targetProperty) {
        updated.push({ sourceField, targetProperty })
      }
      onChange(updated)
    },
    [mappings, onChange],
  )

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: theme.colors.surface.default,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border.subtle}`,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBlock: theme.spacingAlias.sm,
          paddingInline: theme.spacingAlias.md,
          borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
        }}
      >
        <span
          style={{
            fontSize: theme.textStyles.caption.fontSize,
            fontWeight: 600,
            color: theme.colors.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Field Mapping
        </span>
        <span
          style={{
            fontSize: theme.textStyles.caption.fontSize,
            color: theme.colors.text.tertiary,
          }}
        >
          {mappings.length}/{schema.length} mapped
        </span>
      </div>

      {/* Field rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {schema.map((field) => {
          const mapping = getMapping(field.name)
          return (
            <div
              key={field.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[3],
                paddingBlock: theme.spacingAlias.sm,
                paddingInline: theme.spacingAlias.md,
                minHeight: '44px',
                borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
              }}
            >
              {/* Source field */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  minWidth: 0,
                  flex: '0 0 42%',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: theme.radius.sm,
                    background: theme.colors.surface.sunken,
                    color: theme.colors.text.secondary,
                    fontSize: theme.textStyles.caption.fontSize,
                    flexShrink: 0,
                  }}
                >
                  {FIELD_TYPE_ICONS[field.type] ?? '?'}
                </span>
                <span
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.textStyles.body.fontSize,
                    fontFamily: theme.fontFamily.sans,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {field.name}
                </span>
              </div>

              {/* Arrow */}
              <span
                style={{
                  color: theme.colors.text.tertiary,
                  fontSize: theme.textStyles.body.fontSize,
                  flexShrink: 0,
                }}
              >
                →
              </span>

              {/* Target selector */}
              <select
                value={mapping?.targetProperty ?? ''}
                onChange={(e) => handleMap(field.name, e.target.value)}
                style={{
                  flex: 1,
                  height: '36px',
                  paddingInline: theme.spacingAlias.sm,
                  background: theme.colors.surface.sunken,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.radius.md,
                  color: mapping
                    ? theme.colors.text.primary
                    : theme.colors.text.tertiary,
                  fontSize: theme.textStyles.body.fontSize,
                  fontFamily: theme.fontFamily.sans,
                  outline: 'none',
                  cursor: 'pointer',
                  textAlign: 'start' as const,
                }}
              >
                <option value="">Not mapped</option>
                {targetProperties.map((tp) => (
                  <option key={tp.name} value={tp.name}>
                    {tp.label}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}
