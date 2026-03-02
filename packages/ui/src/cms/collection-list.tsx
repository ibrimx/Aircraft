import type { CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { cssTransition } from '@aircraft/design-tokens'
import type { CmsCollection } from '@aircraft/shared-types'

export type CollectionListProps = {
  collections: CmsCollection[]
  selectedId?: string
  onSelect: (collection: CmsCollection) => void
  className?: string
  style?: CSSProperties
}

export function CollectionList({
  collections,
  selectedId,
  onSelect,
  className,
  style,
}: CollectionListProps) {
  const theme = useThemeTokens()

  const listStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxHeight: '360px',
    ...style,
  }

  const metaStyle: CSSProperties = {
    fontSize: theme.textStyles.caption.fontSize,
    color: theme.colors.text.tertiary,
  }

  const syncOffStyle: CSSProperties = {
    fontSize: theme.textStyles.caption.fontSize,
    color: theme.colors.warning.default,
    flexShrink: 0,
  }

  return (
    <div
      className={className}
      role="listbox"
      aria-label="CMS collections"
      style={listStyle}
    >
      {collections.map((collection) => {
        const isSelected = collection.id === selectedId

        const nameStyle: CSSProperties = {
          fontSize: theme.textStyles.body.fontSize,
          fontWeight: isSelected
            ? theme.textStyles.bodyBold.fontWeight
            : theme.textStyles.body.fontWeight,
          color: isSelected
            ? theme.colors.accent.default
            : theme.colors.text.primary,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }

        const rowStyle: CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing[3],
          paddingBlock: theme.spacingAlias.sm,
          paddingInline: theme.spacingAlias.md,
          minHeight: '44px',
          background: isSelected ? theme.colors.accent.subtle : 'transparent',
          border: 'none',
          borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
          cursor: 'pointer',
          outline: 'none',
          textAlign: 'start' as const,
          fontFamily: theme.fontFamily.sans,
          transition: cssTransition('background', 'fast', 'easeInOut'),
          width: '100%',
        }

        return (
          <button
            key={collection.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(collection)}
            style={rowStyle}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing[0.5],
                flex: 1,
                minWidth: 0,
              }}
            >
              <span style={nameStyle}>{collection.name}</span>
              <span style={metaStyle}>
                {collection.schema.length} fields · {collection.recordCount} records
              </span>
            </div>
            {!collection.syncEnabled && <span style={syncOffStyle}>Sync off</span>}
          </button>
        )
      })}
    </div>
  )
}
