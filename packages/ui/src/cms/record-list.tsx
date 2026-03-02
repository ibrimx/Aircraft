import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { cssTransition } from '@aircraft/design-tokens'
import type { CmsRecord, CmsCollection } from '@aircraft/shared-types'
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

  const headerLabelStyle: CSSProperties = {
    fontSize: theme.textStyles.body.fontSize,
    fontWeight: theme.textStyles.bodyBold.fontWeight,
    color: theme.colors.text.primary,
  }

  const headerMetaStyle: CSSProperties = {
    fontSize: theme.textStyles.caption.fontSize,
    color: theme.colors.text.tertiary,
  }

  const searchWrapStyle: CSSProperties = {
    paddingBlock: theme.spacingAlias.sm,
    paddingInline: theme.spacingAlias.md,
    borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
    background: theme.colors.surface.default,
  }

  const listStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[1],
    paddingBlock: theme.spacingAlias.sm,
    paddingInline: theme.spacingAlias.md,
    maxHeight: '420px',
    overflowY: 'auto',
    background: theme.colors.surface.default,
  }

  const emptyStyle: CSSProperties = {
    paddingBlock: theme.spacingAlias.md,
    color: theme.colors.text.tertiary,
    fontSize: theme.textStyles.body.fontSize,
  }

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
          background: theme.colors.surface.default,
        }}
      >
        <span style={headerLabelStyle}>{collection.name}</span>
        <span style={headerMetaStyle}>{records.length} records</span>
      </div>

      {/* Search */}
      <div style={searchWrapStyle}>
        <input
          type="search"
          placeholder="Search records…"
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
      <div style={listStyle}>
        {loading && records.length === 0 ? (
          <div style={emptyStyle}>Loading records…</div>
        ) : filtered.length === 0 ? (
          <div style={emptyStyle}>
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
            background: theme.colors.surface.default,
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
