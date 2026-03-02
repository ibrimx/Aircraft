import { useMemo, type CSSProperties, type FC } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { SPACING } from '@aircraft/design-tokens';
import { cssTransition, EASING } from '@aircraft/design-tokens';
import { ScrollArea } from '@aircraft/ui';
import { IconButton } from '@aircraft/ui';
import { Tooltip } from '@aircraft/ui';

export type HistoryEntry = {
  id: string;
  action: string;
  timestamp: number;
  isCurrent: boolean;
};

export type HistoryPanelProps = {
  entries: HistoryEntry[];
  onJumpTo: (id: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  className?: string;
  style?: CSSProperties;
};

const relativeTime = (ts: number): string => {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export const HistoryPanel: FC<HistoryPanelProps> = ({
  entries, onJumpTo, onUndo, onRedo, canUndo, canRedo, className, style,
}) => {
  const theme = useThemeTokens();

  const sorted = useMemo(
    () => [...entries].sort((a, b) => b.timestamp - a.timestamp),
    [entries],
  );

  const currentIdx = sorted.findIndex((e) => e.isCurrent);

  const rowStyle = (entry: HistoryEntry, idx: number): CSSProperties => {
    const isFuture = currentIdx >= 0 && idx < currentIdx;
    return {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 36, paddingInline: SPACING[2], cursor: 'pointer',
      background: entry.isCurrent ? theme.colors.accent.subtle : 'transparent',
      transition: cssTransition('background', EASING.easeInOut),
      color: entry.isCurrent
        ? theme.colors.accent.default
        : isFuture ? theme.colors.text.tertiary : theme.colors.text.primary,
      fontWeight: entry.isCurrent ? 600 : 400,
    };
  };

  return (
    <div className={className} style={{ background: theme.colors.surface.default, border: `1px solid ${theme.colors.border.subtle}`, display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: SPACING[2], gap: SPACING[1] }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: theme.colors.text.primary, flex: 1 }}>History</span>
        <Tooltip content="Undo">
          <IconButton size="sm" variant="ghost" onClick={onUndo} disabled={!canUndo} aria-label="Undo" icon={<span aria-hidden>↩</span>} />
        </Tooltip>
        <Tooltip content="Redo">
          <IconButton size="sm" variant="ghost" onClick={onRedo} disabled={!canRedo} aria-label="Redo" icon={<span aria-hidden>↪</span>} />
        </Tooltip>
      </div>
      <ScrollArea style={{ flex: 1 }}>
        {sorted.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: SPACING[4], color: theme.colors.text.tertiary, fontSize: 13 }}>No history yet</div>
        ) : sorted.map((entry, idx) => (
          <div key={entry.id} style={rowStyle(entry, idx)} onClick={() => onJumpTo(entry.id)}>
            <span style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.action}</span>
            <span style={{ fontSize: 11, color: theme.colors.text.tertiary, flexShrink: 0, marginInlineStart: SPACING[2] }}>{relativeTime(entry.timestamp)}</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
