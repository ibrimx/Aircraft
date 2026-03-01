import { type CSSProperties } from 'react'
import { ScrollArea } from '@brimair/ui/primitives/scroll-area'
import { Toggle } from '@brimair/ui/primitives/toggle'
import { Tooltip } from '@brimair/ui/primitives/tooltip'
import { Badge } from '@brimair/ui/primitives/badge'
import { Separator } from '@brimair/ui/primitives/separator'
import { useThemeTokens } from '@brimair/design-tokens/theme-provider'
import { SPACING } from '@brimair/design-tokens/spacing'

export type PermissionItem = {
  key: string
  label: string
  description?: string
  enabled: boolean
  locked?: boolean
}

export type PermissionCategory = {
  name: string
  permissions: PermissionItem[]
}

export type PermissionEditorProps = {
  categories: PermissionCategory[]
  onChange: (key: string, enabled: boolean) => void
  readOnly?: boolean
  className?: string
  style?: CSSProperties
}

export function PermissionEditor({ categories, onChange, readOnly = false, className, style }: PermissionEditorProps) {
  const theme = useThemeTokens()

  const visibleCategories = categories
    .filter((c) => c.permissions.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <ScrollArea className={className} style= ...style >
      {visibleCategories.map((cat, catIdx) => (
        <div key={cat.name} style= marginBlockEnd: SPACING[4] >
          <div style= display: 'flex', alignItems: 'center', gap: SPACING[2], marginBlockEnd: SPACING[2] >
            <span style= fontWeight: 600, fontSize: 14, color: theme.text.primary >{cat.name}</span>
            <Badge variant="default" size="sm">{cat.permissions.length}</Badge>
          </div>
          {catIdx > 0 && <Separator style= marginBlockEnd: SPACING[2]  />}

          {cat.permissions.map((perm) => (
            <div
              key={perm.key}
              style=
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: SPACING[3],
                paddingBlock: SPACING[2],
                paddingInline: SPACING[2],
                minHeight: 44,
              
            >
              <div style= flex: 1, minWidth: 0 >
                <span style= fontSize: 13, color: theme.text.primary, fontWeight: 500 >{perm.label}</span>
                {perm.description && (
                  <p style= fontSize: 12, color: theme.text.secondary, marginBlockStart: 2, lineHeight: '16px' >{perm.description}</p>
                )}
              </div>

              <div style= display: 'flex', alignItems: 'center', gap: SPACING[2], flexShrink: 0 >
                {perm.locked && (
                  <Tooltip content="System permission">
                    <span style= fontSize: 14, color: theme.text.tertiary  aria-label="Locked">🔒</span>
                  </Tooltip>
                )}
                <Toggle
                  checked={perm.enabled}
                  onChange={(val) => onChange(perm.key, val)}
                  disabled={readOnly || perm.locked}
                  aria-label={perm.label}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </ScrollArea>
  )
}
