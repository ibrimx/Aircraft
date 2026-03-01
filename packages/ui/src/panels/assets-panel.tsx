import { useState, useCallback, useMemo, useRef, useEffect, type CSSProperties, type FC } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { SPACING } from '@aircraft/design-tokens';
import { cssTransition, EASING } from '@aircraft/design-tokens';
import { ScrollArea } from '@aircraft/ui';
import { Input } from '@aircraft/ui';
import { IconButton } from '@aircraft/ui';
import { Skeleton } from '@aircraft/ui';

export type AssetItem = {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'shape' | 'video';
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
};

export type AssetCategory = 'all' | 'images' | 'icons' | 'shapes' | 'videos';

const CATEGORIES: AssetCategory[] = ['all', 'images', 'icons', 'shapes', 'videos'];

const categoryMap: Record<AssetCategory, AssetItem['type'] | null> = {
  all: null, images: 'image', icons: 'icon', shapes: 'shape', videos: 'video',
};

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

export type AssetsPanelProps = {
  assets: AssetItem[];
  loading?: boolean;
  selectedId?: string;
  onSelect: (id: string) => void;
  onDragStart: (asset: AssetItem) => void;
  onUpload: (files: File[]) => void;
  onDelete: (id: string) => void;
  className?: string;
  style?: CSSProperties;
};

export const AssetsPanel: FC<AssetsPanelProps> = ({
  assets, loading = false, selectedId, onSelect, onDragStart,
  onUpload, onDelete, className, style,
}) => {
  const theme = useThemeTokens();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<AssetCategory>('all');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    let list = assets;
    const typeFilter = categoryMap[category];
    if (typeFilter) list = list.filter((a) => a.type === typeFilter);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }
    return list;
  }, [assets, category, debouncedSearch]);

  const handleUploadClick = useCallback(() => fileRef.current?.click(), []);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onUpload(Array.from(e.target.files));
    e.target.value = '';
  }, [onUpload]);

  const gridStyle: CSSProperties = {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: SPACING[2], padding: SPACING[2],
  };

  const cardStyle = (id: string): CSSProperties => ({
    background: theme.colors.surface.raised, borderRadius: theme.radii.md,
    overflow: 'hidden', cursor: 'pointer',
    outline: selectedId === id ? `2px solid ${theme.colors.accent.default}` : 'none',
    outlineOffset: -2, transition: cssTransition('box-shadow', EASING.easeInOut),
  });

  return (
    <div className={className} style={{ background: theme.colors.surface.default, border: `1px solid ${theme.colors.border.subtle}`, display: 'flex', flexDirection: 'column', ...style }}>
      <div style= display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: SPACING[2], paddingBlock: SPACING[2] >
        <span style= fontWeight: 600, fontSize: 13 >Assets</span>
        <IconButton size="sm" variant="ghost" onClick={handleUploadClick} aria-label="Upload asset">⬆</IconButton>
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple hidden onChange={handleFileChange} />
      </div>
      <div style= paddingInline: SPACING[2], paddingBlockEnd: SPACING[1] >
        <Input value={search} onChange={setSearch} placeholder="Search assets\u2026" />
      </div>
      <div style= display: 'flex', gap: SPACING[1], paddingInline: SPACING[2], paddingBlockEnd: SPACING[2], flexWrap: 'wrap' >
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{
            background: c === category ? theme.colors.accent.subtle : 'transparent',
            color: c === category ? theme.colors.accent.default : theme.colors.text.secondary,
            border: 'none', borderRadius: theme.radii.sm, padding: `${SPACING[1]}px ${SPACING[2]}px`,
            cursor: 'pointer', fontSize: 12, textTransform: 'capitalize',
            transition: cssTransition('background', EASING.easeInOut),
          }}>{c}</button>
        ))}
      </div>
      <ScrollArea style= flex: 1 >
        {loading ? (
          <div style={gridStyle}>{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} style= height: 80, borderRadius: theme.radii.md  />)}</div>
        ) : filtered.length === 0 ? (
          <div style= display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: SPACING[4], color: theme.colors.text.tertiary, fontSize: 13, gap: SPACING[1] >
            <span>No assets</span>
            <button onClick={handleUploadClick} style= background: 'none', border: 'none', color: theme.colors.accent.default, cursor: 'pointer', fontSize: 12 >Upload files</button>
          </div>
        ) : (
          <div style={gridStyle}>
            {filtered.map((asset) => (
              <div key={asset.id} style={cardStyle(asset.id)} onClick={() => onSelect(asset.id)} draggable onDragStart={() => onDragStart(asset)}>
                <img src={asset.thumbnailUrl} alt={asset.name} style= width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block'  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div style= padding: SPACING[1] >
                  <div style= fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: theme.colors.text.primary >{asset.name}</div>
                  <div style= fontSize: 11, color: theme.colors.text.tertiary >{formatSize(asset.size)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
