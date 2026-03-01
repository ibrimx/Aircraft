import { useMemo, type CSSProperties, type FC } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { SPACING } from '@aircraft/design-tokens';
import { cssTransition, EASING } from '@aircraft/design-tokens';
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
    transition: cssTransition('box-shadow', EASING.easeInOut),
  };

  return (
    <div className={className} style={{ background: theme.colors.surface.default, border: `1px solid ${theme.colors.border.subtle}`, display: 'flex', flexDirection: 'column', ...style }}>
      <div style= paddingInline: SPACING[2], paddingBlock: SPACING[2] >
        <span style= fontWeight: 600, fontSize: 13 >Components</span>
      </div>
      <div style= paddingInline: SPACING[2], paddingBlockEnd: SPACING[2] >
        <Input value={searchQuery} onChange={onSearch} placeholder="Search components\u2026" />
      </div>
      <ScrollArea style= flex: 1 >
        {loading ? (
          <div style= display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING[2], padding: SPACING[2] >
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style= height: 100, borderRadius: theme.radii.md  />)}
          </div>
        ) : grouped.length === 0 ? (
          <div style= display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SPACING[4], color: theme.colors.text.tertiary, fontSize: 13 >No components found</div>
        ) : grouped.map(([cat, items]) => (
          <div key={cat} style= paddingInline: SPACING[2], paddingBlockEnd: SPACING[2] >
            <div style= display: 'flex', alignItems: 'center', gap: SPACING[1], paddingBlockEnd: SPACING[1] >
              <span style= fontWeight: 600, fontSize: 12, color: theme.colors.text.secondary >{cat}</span>
              <span style= fontSize: 11, color: theme.colors.text.tertiary, background: theme.colors.surface.raised, borderRadius: theme.radii.full, paddingInline: SPACING[1], minWidth: 18, textAlign: 'center' >{items.length}</span>
            </div>
            <div style= display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING[2] >
              {items.map((comp) => (
                <div key={comp.id} style={cardStyle} onClick={() => onInsert(comp.id)} draggable onDragStart={() => onDragStart(comp)}>
                  {comp.previewUrl ? (
                    <img src={comp.previewUrl} alt={comp.name} style= width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block'  />
                  ) : (
                    <div style= width: '100%', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.colors.surface.sunken, color: theme.colors.text.tertiary, fontSize: 24 >\u2b1c</div>
                  )}
                  <div style= padding: SPACING[1] >
                    <div style= fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: theme.colors.text.primary >{comp.name}</div>
                    {comp.description && (
                      <div style= fontSize: 11, color: theme.colors.text.secondary, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' >{comp.description}</div>
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
