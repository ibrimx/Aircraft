import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'
import { cssTransition } from '@brimair/design-tokens'
import type { CmsRecord, CmsCollection } from '@brimair/shared-types'
import { RecordCard } from './record-card'

export type RecordListProps = {
  collection: CmsCollection
  records: CmsRecord[]
  selectedId?: string
  onSelect: (record: CmsRecord) => void
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
  className?: string
  style?: CSSProperties
}

export function RecordList({
  collection,
  records,
  selectedId,
  onSelect,
  onLoadMore,
  hasMore = false,
  loading = false,
  className,
  style,
}: RecordListProps) {
  const theme = useThemeTokens()
  const [search, setSearch] = useState('')

  const titleField = useMemo(() => {
    const textField = collection.schema.find((f) => f.type === 'text')
    return textField?.name ?? collection.schema[0]?.name
  }, [collection.schema])

  const filtered = useMemo(() => {
    if (!search.trim()) return records
    const q = search.toLowerCase()
    return records.filter((r) => {
      const title = titleField && r.fields[titleField]
      if (typeof title === 'string' && title.toLowerCase().includes(q)) return true
      return r.externalId.toLowerCase().includes(q)
    })
  }, [records, search, titleField])

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
          style=
            fontSize: theme.textStyles.subtitle.fontSize,
            fontWeight: theme.textStyles.subtitle.fontWeight,
            color: theme.colors.text.primary,
            fontFamily: theme.fontFamily.sans,
          
        >
          {collection.name}
        </span>
        <span
          style=
            fontSize: theme.textStyles.caption.fontSize,
            color: theme.colors.text.tertiary,
            fontFamily: theme.fontFamily.sans,
          
        >
          {records.length} records
        </span>
      </div>

      {/* Search */}
      <div style= paddingBlock: theme.spacing[2], paddingInline: theme.spacingAlias.md >
        <input
          type="search"
          placeholder="Search records\u2026"
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

      {/* Records */}
      <div
        style=
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing[2],
          paddingBlock: theme.spacing[2],
          paddingInline: theme.spacingAlias.md,
          overflowY: 'auto',
          maxHeight: '400px',
        
      >
        {loading && records.length === 0 ? (
          <div
            style=
              paddingBlock: theme.spacingAlias.xl,
              textAlign: 'center',
              color: theme.colors.text.tertiary,
              fontSize: theme.textStyles.body.fontSize,
              fontFamily: theme.fontFamily.sans,
            
          >
            Loading records\u2026
          </div>
        ) : filtered.length === 0 ? (
          <div
            style=
              paddingBlock: theme.spacingAlias.xl,
              textAlign: 'center',
              color: theme.colors.text.tertiary,
              fontSize: theme.textStyles.body.fontSize,
              fontFamily: theme.fontFamily.sans,
            
          >
            {search ? 'No matching records' : 'No records in collection'}
          </div>
        ) : (
          filtered.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              schema={collection.schema}
              titleField={titleField}
              selected={record.id === selectedId}
              onClick={onSelect}
            />
          ))
        )}
      </div>

      {/* Load more */}
      {hasMore && !loading && (
        <div
          style={{
            paddingBlock: theme.spacingAlias.sm,
            paddingInline: theme.spacingAlias.md,
            borderBlockStart: `1px solid ${theme.colors.border.subtle}`,
          }}
        >
          <button
            type="button"
            onClick={onLoadMore}
            style={{
              width: '100%',
              height: '40px',
              background: 'transparent',
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.radius.md,
              color: theme.colors.accent.default,
              fontSize: theme.textStyles.body.fontSize,
              fontFamily: theme.fontFamily.sans,
              cursor: 'pointer',
              transition: cssTransition('background', 'normal', 'easeInOut'),
            }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
