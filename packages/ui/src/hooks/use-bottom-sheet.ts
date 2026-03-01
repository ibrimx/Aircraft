// packages/ui/src/hooks/use-bottom-sheet.ts
import { useCallback, useRef, useState } from 'react';
import type { SheetSnapConfig } from '@brimair/shared-types';
import { SHEET_SNAP_CONFIG } from '@brimair/shared-types';
import { useHaptic } from './use-haptic';
import { useReducedMotion } from './use-reduced-motion';

// ── Types ────────────────────────────────────────────────
export type SheetSnap = keyof SheetSnapConfig;

export type UseBottomSheetReturn = {
  currentSnap: SheetSnap;
  snapTo: (snap: SheetSnap) => void;
  heightPercent: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragMove: (deltaY: number) => void;
  onDragEnd: (velocityY: number) => void;
};

type Options = {
  initialSnap?: SheetSnap;
  enableHaptic?: boolean;
  onSnapChange?: (snap: SheetSnap) => void;
};

const SNAP_ORDER: readonly SheetSnap[] = ['closed', 'peek', 'half', 'full'] as const;
const VELOCITY_THRESHOLD = 0.5;

// ── Hook ─────────────────────────────────────────────────
export function useBottomSheet(options?: Options): UseBottomSheetReturn {
  const { initialSnap = 'peek', enableHaptic = true, onSnapChange } = options ?? {};
  const { trigger } = useHaptic();
  const reducedMotion = useReducedMotion();

  const [currentSnap, setCurrentSnap] = useState<SheetSnap>(initialSnap);
  const [heightPercent, setHeightPercent] = useState(SHEET_SNAP_CONFIG[initialSnap]);
  const [isDragging, setIsDragging] = useState(false);
  const prevSnapRef = useRef<SheetSnap>(initialSnap);

  const applySnap = useCallback((snap: SheetSnap) => {
    setCurrentSnap(snap);
    setHeightPercent(SHEET_SNAP_CONFIG[snap]);
    if (snap !== prevSnapRef.current) {
      if (enableHaptic && !reducedMotion) trigger('selection');
      onSnapChange?.(snap);
    }
    prevSnapRef.current = snap;
  }, [enableHaptic, reducedMotion, trigger, onSnapChange]);

  const snapTo = useCallback((snap: SheetSnap) => applySnap(snap), [applySnap]);

  const onDragStart = useCallback(() => setIsDragging(true), []);

  const onDragMove = useCallback((deltaY: number) => {
    setHeightPercent((prev) => Math.min(0.92, Math.max(0, prev - deltaY)));
  }, []);

  const onDragEnd = useCallback((velocityY: number) => {
    setIsDragging(false);
    setHeightPercent((current) => {
      const snapValues = SNAP_ORDER.map((k) => ({ key: k, val: SHEET_SNAP_CONFIG[k] }));
      let target: SheetSnap;
      if (Math.abs(velocityY) > VELOCITY_THRESHOLD) {
        const dir = velocityY < 0 ? 1 : -1;
        const idx = SNAP_ORDER.indexOf(prevSnapRef.current);
        const next = Math.min(SNAP_ORDER.length - 1, Math.max(0, idx + dir));
        target = SNAP_ORDER[next];
      } else {
        target = snapValues.reduce((best, s) =>
          Math.abs(s.val - current) < Math.abs(best.val - current) ? s : best,
        ).key;
      }
      applySnap(target);
      return SHEET_SNAP_CONFIG[target];
    });
  }, [applySnap]);

  return { currentSnap, snapTo, heightPercent, isDragging, onDragStart, onDragMove, onDragEnd };
}
