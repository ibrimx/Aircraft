import { useState, type CSSProperties, type FC } from 'react';
import { useThemeTokens } from '@brimair/design-tokens';
import { SPACING } from '@brimair/design-tokens';
import { cssTransition, EASING } from '@brimair/design-tokens';
import { TEXT_STYLES } from '@brimair/design-tokens';
import { ScrollArea } from '@brimair/ui';
import { Select } from '@brimair/ui';
import { Button, IconButton } from '@brimair/ui';
import { Badge } from '@brimair/ui';
import { Skeleton } from '@brimair/ui';
import { Tooltip } from '@brimair/ui';

export type CmsSource = {
  id: string;
  name: string;
  type: 'notion' | 'airtable' | 'google-sheets' | 'supabase' | 'rest-api' | 'json' | 'markdown';
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
};

export type CmsCollection = {
  id: string;
  name: string;
  recordCount: number;
  fields: CmsField[];
};

export type CmsField = {
  id: string;
  name: string;
  type: 'text' | 'rich-text' | 'number' | 'date' | 'image' | 'relation' | 'select' | 'boolean';
};

export type CmsRecord = {
  id: string;
  title: string;
  fields: Record<string, unknown>;
};

export type CmsPanelProps = {
  sources: CmsSource[];
  selectedSourceId?: string;
  collections: CmsCollection[];
  selectedCollectionId?: string;
  records: CmsRecord[];
  loading?: boolean;
  onSelectSource: (id: string) => void;
  onSelectCollection: (id: string) => void;
  onBindField: (field: CmsField) => void;
  onDragField: (field: CmsField) => void;
  onRefresh: () => void;
  className?: string;
  style?: CSSProperties;
};

const STATUS_COLOR: Record<CmsSource['status'], string> = {
  connected: 'green', syncing: 'yellow', error: 'red', disconnected: 'gray',
};

const FIELD_ICONS: Record<CmsField['type'], string> = {
  text: 'T', 'rich-text': '\u00b6', number: '#', date: '\ud83d\udcc5',
  image: '\ud83d\uddbc', relation: '\ud83d\udd17', select: '\u25bc', boolean: '\u2714',
};

const truncate = (str: string, max: number): string =>
  str.length > max ? `${str.slice(0, max)}\u2026` : str;

export const CmsPanel: FC<CmsPanelProps> = ({
  sources, selectedSourceId, collections, selectedCollectionId,
  records, loading = false, onSelectSource, onSelectCollection,
  onBindField, onDragField, onRefresh, className, style,
}) => {
  const theme = useThemeTokens();
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());

  const selectedSource = sources.find((s) => s.id === selectedSourceId);
  const selectedCollection = collections.find((c) => c.id === selectedCollectionId);

  const toggleRecord = (id: string) => {
    setExpandedRecords((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (sources.length === 0 && !loading) {
    return (
      <div className={className} style={{ background: theme.colors.surface.default, border: `1px solid ${theme.colors.border.subtle}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: SPACING[4], gap: SPACING[2], ...style }}>
        <span style= color: theme.colors.text.secondary >No sources connected</span>
        <Button variant="secondary">Connect a source</Button>
      </div>
    );
  }

  const sourceOptions = sources.map((s) => ({ value: s.id, label: s.name }));
  const collectionOptions = collections.map((c) => ({ value: c.id, label: `${c.name} (${c.recordCount})` }));

  return (
    <div className={className} style={{ background: theme.colors.surface.default, border: `1px solid ${theme.colors.border.subtle}`, display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ padding: `${SPACING[2]}px ${SPACING[3]}px`, display: 'flex', alignItems: 'center' }}>
        <span style= ...TEXT_STYLES.heading, flex: 1 >CMS</span>
        <Tooltip content="Refresh"><IconButton size="sm" variant="ghost" onClick={onRefresh} aria-label="Refresh">\u21bb</IconButton></Tooltip>
      </div>
      <ScrollArea style= flex: 1 >
        <div style={{ padding: `0 ${SPACING[3]}px`, display: 'flex', flexDirection: 'column', gap: SPACING[3], paddingBlockEnd: SPACING[3] }}>
          {/* Step 1: Source */}
          <div style= display: 'flex', flexDirection: 'column', gap: SPACING[1] >
            <span style= ...TEXT_STYLES.label, color: theme.colors.text.secondary >Source</span>
            {loading && !selectedSourceId ? <Skeleton style= blockSize: 36, borderRadius: theme.radii.md  /> : (
              <div style= display: 'flex', alignItems: 'center', gap: SPACING[1] >
                <div style= flex: 1 ><Select options={sourceOptions} value={selectedSourceId ?? ''} onChange={onSelectSource} /></div>
                {selectedSource && <Badge variant={STATUS_COLOR[selectedSource.status]}>{selectedSource.status}</Badge>}
                {selectedSource?.status === 'error' && <Button size="sm" variant="ghost">Reconnect</Button>}
                {selectedSource?.status === 'disconnected' && <Button size="sm" variant="ghost">Connect</Button>}
              </div>
            )}
          </div>
          {/* Step 2: Collection */}
          {selectedSourceId && (
            <div style= display: 'flex', flexDirection: 'column', gap: SPACING[1] >
              <span style= ...TEXT_STYLES.label, color: theme.colors.text.secondary >Collection</span>
              {loading && !selectedCollectionId ? <Skeleton style= blockSize: 36, borderRadius: theme.radii.md  /> : (
                <Select options={collectionOptions} value={selectedCollectionId ?? ''} onChange={onSelectCollection} />
              )}
            </div>
          )}
          {/* Step 3: Fields */}
          {selectedCollection && (
            <div style= display: 'flex', flexDirection: 'column', gap: SPACING[1] >
              <span style= ...TEXT_STYLES.label, color: theme.colors.text.secondary >Fields</span>
              {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} style= blockSize: 36, borderRadius: theme.radii.md  />) : (
                selectedCollection.fields.map((field) => (
                  <div key={field.id} onClick={() => onBindField(field)} draggable onDragStart={() => onDragField(field)} style=
                    display: 'flex', alignItems: 'center', gap: SPACING[1],
                    blockSize: 36, paddingInline: SPACING[2], cursor: 'pointer',
                    borderRadius: theme.radii.sm, background: theme.colors.surface.raised,
                    transition: cssTransition('background', EASING.easeInOut),
                  >
                    <span style= inlineSize: 20, textAlign: 'center', fontSize: 12 >{FIELD_ICONS[field.type]}</span>
                    <span style= flex: 1, ...TEXT_STYLES.body >{field.name}</span>
                    <Badge variant="gray">{field.type}</Badge>
                  </div>
                ))
              )}
            </div>
          )}
          {/* Step 4: Records preview */}
          {selectedCollection && records.length > 0 && (
            <div style= display: 'flex', flexDirection: 'column', gap: SPACING[1] >
              <span style= ...TEXT_STYLES.label, color: theme.colors.text.secondary >Records ({records.length})</span>
              {records.slice(0, 5).map((rec) => (
                <div key={rec.id} onClick={() => toggleRecord(rec.id)} style=
                  padding: SPACING[2], borderRadius: theme.radii.sm,
                  background: theme.colors.surface.raised, cursor: 'pointer',
                  transition: cssTransition('background', EASING.easeInOut),
                >
                  <div style= ...TEXT_STYLES.body, fontWeight: 500 >{truncate(rec.title, 50)}</div>
                  {expandedRecords.has(rec.id) && (
                    <div style= marginBlockStart: SPACING[1], display: 'flex', flexDirection: 'column', gap: 2 >
                      {Object.entries(rec.fields).map(([key, val]) => (
                        <div key={key} style= display: 'flex', gap: SPACING[1], ...TEXT_STYLES.caption >
                          <span style= color: theme.colors.text.tertiary >{key}:</span>
                          <span style= color: theme.colors.text.secondary >{truncate(String(val ?? ''), 50)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
