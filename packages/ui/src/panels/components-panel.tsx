import { useMemo, type CSSProperties, type FC } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { SPACING } from '@aircraft/design-tokens';
import { cssTransition } from '@aircraft/design-tokens';
import { ScrollArea } from '@aircraft/ui';
import { Input } from '@aircraft/ui';
import { Skeleton } from '@aircraft/ui';

export type ComponentItem = {
  id: string;
  name: string;
  category: string;
  previewUrl?: string;
  description?: string;
};

export type ComponentsPanelProps = {
  components: ComponentItem[];
  loading?: boolean;
  searchQuery?: string;
  onSearch: (query: string) => void;
  onInsert: (id: string) => void;
  onDragStart: (component: ComponentItem) => void;
  className?: string;
  style?: CSSProperties;
};

export const ComponentsPanel: FC<ComponentsPanelProps> = ({
  components, loading = false, searchQuery = '', onSearch,
  onInsert, onDragStart, className, style,
}) => {
  const theme = useThemeTokens();

  const filtered = useMemo(() => {
    if (!searchQuery) return components;
    const q = searchQuery.toLowerCase();
    return components.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.category.toLowerCase().includes(q),
    );
  }, [components, searchQuery]);

  const grouped = useMemo(() => {
    const map = new Map<string, ComponentItem[]>();
    for (const c of filtered) {
      const list = map.get(c.category) ?? [];
      list.push(c);
      map.set(c.category, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const cardStyle: CSSProperties = {
    background: theme.colors.surface.raised, borderRadius: theme.radii.md,
    overflow: 'hidden', cursor: 'pointer',
    transition: cssTransition('box-shadow', 'normal', 'easeInOut'),
  };

  return (
    <div className={className} style={{ background: theme.colors.surface.default, border: `1px solid ${theme.colors.border.subtle}`, display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: SPACING[3], paddingBlock: SPACING[2], borderBlockEnd: `1px solid ${theme.colors.border.subtle}` }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Components</span>
      </div>
      <div style={{ paddingInline: SPACING[3], paddingBlock: SPACING[2], borderBlockEnd: `1px solid ${theme.colors.border.subtle}` }}>
        <Input value={searchQuery} onChange={onSearch} placeholder="Search components…" />
      </div>
      <ScrollArea style={{ flex: 1, minBlockSize: 0 }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: SPACING[2], padding: SPACING[2] }}>
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style={{ blockSize: 80, borderRadius: theme.radii.md }} />)}
          </div>
        ) : grouped.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SPACING[4], fontSize: 13, color: theme.colors.text.tertiary }}>No components found</div>
        ) : grouped.map(([cat, items]) => (
          <div key={cat} style={{ paddingInline: SPACING[3], paddingBlock: SPACING[2] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: SPACING[2] }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: theme.colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cat}</span>
              <span style={{ fontSize: 11, color: theme.colors.text.tertiary }}>{items.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: SPACING[2] }}>
              {items.map((comp) => (
                <div key={comp.id} style={cardStyle} onClick={() => onInsert(comp.id)} draggable onDragStart={() => onDragStart(comp)}>
                  {comp.previewUrl ? (
                    <img src={comp.previewUrl} alt={comp.name} style={{ display: 'block', inlineSize: '100%', blockSize: 64, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ blockSize: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: theme.colors.surface.sunken }}>⬜</div>
                  )}
                  <div style={{ padding: `${SPACING[1]}px ${SPACING[2]}px` }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: theme.colors.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comp.name}</div>
                    {comp.description && (
                      <div style={{ fontSize: 10, color: theme.colors.text.tertiary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comp.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
