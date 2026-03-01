import { type CSSProperties } from 'react'
import { ScrollArea } from '@aircraft/ui/primitives/scroll-area'
import { Toggle } from '@aircraft/ui/primitives/toggle'
import { Tooltip } from '@aircraft/ui/primitives/tooltip'
import { Badge } from '@aircraft/ui/primitives/badge'
import { Separator } from '@aircraft/ui/primitives/separator'
import { useThemeTokens } from '@aircraft/design-tokens/theme-provider'
import { SPACING } from '@aircraft/design-tokens/spacing'

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
    <ScrollArea className={className} style=474>
      {visibleCategories.map((cat, catIdx) => (
        <div key={cat.name} style=475>
          <div style=476>
            <span style=477>{cat.name}</span>
            <Badge variant="default" size="sm">{cat.permissions.length}</Badge>
          </div>
          {catIdx > 0 && <Separator style=478 />}

          {cat.permissions.map((perm) => (
            <div
              key={perm.key}
              style=479
            >
              <div style= flex: 1, minWidth: 0 >
                <span style=480>{perm.label}</span>
                {perm.description && (
                  <p style=481>{perm.description}</p>
                )}
              </div>

              <div style=482>
                {perm.locked && (
                  <Tooltip content="System permission">
                    <span style=483 aria-label="Locked">🔒</span>
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
