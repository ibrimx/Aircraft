import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens, cssTransition } from '@aircraft/design-tokens'
import type { CmsCollection, CmsSource } from '@aircraft/shared-types'

export type CollectionBrowserProps = {
  source: CmsSource
  collections: CmsCollection[]
  selectedId?: string
  onSelect: (collection: CmsCollection) => void
  onRefresh: () => void
  loading?: boolean
  className?: string
  style?: CSSProperties
}

export function CollectionBrowser({
  source,
  collections,
  selectedId,
  onSelect,
  onRefresh,
  loading = false,
  className,
  style,
}: CollectionBrowserProps) {
  const theme = useThemeTokens()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return collections
    const q = search.toLowerCase()
    return collections.filter((c) => c.name.toLowerCase().includes(q))
  }, [collections, search])

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacingAlias.sm,
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[0.5] }}>
          <span
            style={{
              fontSize: theme.textStyles.subtitle.fontSize,
              fontWeight: theme.textStyles.subtitle.fontWeight,
              fontFamily: theme.fontFamily.sans,
              color: theme.colors.text.primary,
            }}
          >
            Collections
          </span>
          <span
            style={{
              fontSize: theme.textStyles.caption.fontSize,
              fontFamily: theme.fontFamily.sans,
              color: theme.colors.text.tertiary,
            }}
          >
            {source.name} · {collections.length} collections
          </span>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh collections"
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: `1px solid ${theme.colors.border.subtle}`,
            borderRadius: theme.radius.md,
            color: theme.colors.text.secondary,
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.4 : 1,
            transition: cssTransition('background', 'fast', 'easeInOut'),
          }}
        >
          ↻
        </button>
      </div>

      {/* Search */}
      <div style={{ paddingInline: theme.spacingAlias.md }}>
        <input
          type="search"
          placeholder="Search collections…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            height: '36px',
            paddingInline: theme.spacingAlias.sm,
            background: theme.colors.surface.sunken,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.radius.md,
            color: theme.colors.text.primary,
            fontSize: theme.textStyles.body.fontSize,
            fontFamily: theme.fontFamily.sans,
            outline: 'none',
            textAlign: 'start' as const,
            transition: cssTransition('border-color', 'normal', 'easeInOut'),
          }}
        />
      </div>

      {/* Collection list */}
      {loading ? (
        <div
          style={{
            paddingBlock: theme.spacingAlias.xl,
            textAlign: 'center',
            fontSize: theme.textStyles.body.fontSize,
            fontFamily: theme.fontFamily.sans,
            color: theme.colors.text.tertiary,
          }}
        >
          Loading collections…
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            paddingBlock: theme.spacingAlias.xl,
            textAlign: 'center',
            fontSize: theme.textStyles.body.fontSize,
            fontFamily: theme.fontFamily.sans,
            color: theme.colors.text.tertiary,
          }}
        >
          {search ? 'No matching collections' : 'No collections found'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((collection) => (
            <button
              key={collection.id}
              type="button"
              onClick={() => onSelect(collection)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[3],
                paddingBlock: theme.spacing[2],
                paddingInline: theme.spacingAlias.md,
                background:
                  collection.id === selectedId
                    ? theme.colors.accent.subtle
                    : 'transparent',
                border: 'none',
                borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
                color: theme.colors.text.primary,
                fontSize: theme.textStyles.body.fontSize,
                fontFamily: theme.fontFamily.sans,
                cursor: 'pointer',
                textAlign: 'start' as const,
                transition: cssTransition('background', 'fast', 'easeInOut'),
              }}
            >
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {collection.name}
              </span>
              {collection.recordCount !== undefined && (
                <span style={{ fontSize: theme.textStyles.caption.fontSize, color: theme.colors.text.tertiary, flexShrink: 0 }}>
                  {collection.recordCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
