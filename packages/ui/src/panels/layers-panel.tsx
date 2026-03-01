import { useState, useCallback, useMemo, type CSSProperties, type FC } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { SPACING } from '@aircraft/design-tokens';
import { cssTransition, EASING } from '@aircraft/design-tokens';
import { ScrollArea } from '@aircraft/ui';
import { Input } from '@aircraft/ui';
import { IconButton } from '@aircraft/ui';
import { Tooltip } from '@aircraft/ui';

export type LayerItem = {
  id: string;
  name: string;
  type: 'frame' | 'text' | 'image' | 'shape' | 'group' | 'component';
  visible: boolean;
  locked: boolean;
  children?: LayerItem[];
  depth: number;
};

export type LayersPanelProps = {
  layers: LayerItem[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorder: (id: string, newIndex: number, parentId?: string) => void;
  onRename: (id: string, name: string) => void;
  className?: string;
  style?: CSSProperties;
};

const filterLayers = (layers: LayerItem[], query: string): LayerItem[] => {
  if (!query) return layers;
  const q = query.toLowerCase();
  return layers.reduce<LayerItem[]>((acc, layer) => {
    const childMatches = layer.children ? filterLayers(layer.children, query) : [];
    if (layer.name.toLowerCase().includes(q) || childMatches.length > 0) {
      acc.push({ ...layer, children: childMatches.length > 0 ? childMatches : layer.children });
    }
    return acc;
  }, []);
};

const flattenLayers = (layers: LayerItem[]): LayerItem[] =>
  layers.reduce<LayerItem[]>((acc, l) => {
    acc.push(l);
    if (l.children) acc.push(...flattenLayers(l.children));
    return acc;
  }, []);

export const LayersPanel: FC<LayersPanelProps> = ({
  layers, selectedIds, onSelect, onToggleVisibility, onToggleLock,
  onReorder, onRename, className, style,
}) => {
  const theme = useThemeTokens();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filtered = useMemo(() => filterLayers(layers, search), [layers, search]);
  const flat = useMemo(() => flattenLayers(filtered), [filtered]);

  const handleSelect = useCallback((id: string, e: React.MouseEvent) => {
    if (e.shiftKey && selectedIds.length > 0) {
      const ids = flat.map((l) => l.id);
      const last = ids.indexOf(selectedIds[selectedIds.length - 1]);
      const cur = ids.indexOf(id);
      const [s, e2] = last < cur ? [last, cur] : [cur, last];
      onSelect(ids.slice(s, e2 + 1));
    } else if (e.metaKey || e.ctrlKey) {
      onSelect(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
    } else { onSelect([id]); }
  }, [selectedIds, flat, onSelect]);

  const startRename = useCallback((layer: LayerItem) => {
    setEditingId(layer.id);
    setEditValue(layer.name);
  }, []);

  const confirmRename = useCallback(() => {
    if (editingId && editValue.trim()) onRename(editingId, editValue.trim());
    setEditingId(null);
  }, [editingId, editValue, onRename]);

  const rowStyle = (layer: LayerItem): CSSProperties => ({
    display: 'flex', alignItems: 'center', height: 32,
    paddingInlineStart: layer.depth * 16 + SPACING[2],
    paddingInlineEnd: SPACING[2], gap: SPACING[1],
    background: selectedIds.includes(layer.id) ? theme.colors.accent.subtle : 'transparent',
    cursor: 'pointer', transition: cssTransition('background', EASING.easeInOut),
  });

  return (
    <div className={className} style={{ background: theme.colors.surface.default, border: `1px solid ${theme.colors.border.subtle}`, display: 'flex', flexDirection: 'column', ...style }}>
      <div style= display: 'flex', alignItems: 'center', padding: SPACING[2], gap: SPACING[2] >
        <span style= fontWeight: 600, fontSize: 13, color: theme.colors.text.primary, flex: 1 >Layers</span>
      </div>
      <div style= paddingInline: SPACING[2], paddingBlockEnd: SPACING[1] >
        <Input value={search} onChange={(v) => setSearch(v)} placeholder="Search layers…" />
      </div>
      <ScrollArea style= flex: 1 >
        {flat.length === 0 ? (
          <div style= display: 'flex', justifyContent: 'center', padding: SPACING[4], color: theme.colors.text.tertiary, fontSize: 13 >No layers</div>
        ) : flat.map((layer) => (
          <div key={layer.id} style={rowStyle(layer)} onClick={(e) => handleSelect(layer.id, e)} onDoubleClick={() => startRename(layer)} draggable onDragStart={(e) => { e.dataTransfer.setData('text/plain', layer.id); }} onDrop={(e) => { e.preventDefault(); const srcId = e.dataTransfer.getData('text/plain'); if (srcId !== layer.id) onReorder(srcId, flat.indexOf(layer)); }} onDragOver={(e) => e.preventDefault()}>
            <span style= width: 16, fontSize: 11, color: theme.colors.text.secondary >{layer.children?.length ? '▸' : ' '}</span>
            <span style= fontSize: 11, color: theme.colors.text.secondary, width: 16 >{layer.type[0].toUpperCase()}</span>
            {editingId === layer.id ? (
              <Input value={editValue} onChange={setEditValue} onBlur={confirmRename} onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') confirmRename(); if (e.key === 'Escape') setEditingId(null); }} autoFocus style= flex: 1, fontSize: 16  />
            ) : (
              <span style= flex: 1, fontSize: 13, color: selectedIds.includes(layer.id) ? theme.colors.accent.default : theme.colors.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' >{layer.name}</span>
            )}
            <Tooltip content={layer.visible ? 'Hide' : 'Show'}>
              <IconButton size="sm" variant="ghost" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onToggleVisibility(layer.id); }} aria-label={layer.visible ? 'Hide layer' : 'Show layer'}>{'\uD83D\uDC41'}</IconButton>
            </Tooltip>
            <Tooltip content={layer.locked ? 'Unlock' : 'Lock'}>
              <IconButton size="sm" variant="ghost" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onToggleLock(layer.id); }} aria-label={layer.locked ? 'Unlock layer' : 'Lock layer'}>{layer.locked ? '🔒' : '🔓'}</IconButton>
            </Tooltip>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
