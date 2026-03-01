// packages/ui/src/hooks/use-gesture-state.ts
import { useCallback, useRef, useState } from 'react';
import type { GestureDirection } from '@brimair/shared-types';

// ── Types ────────────────────────────────────────────────
export type GestureState = {
  isGesturing: boolean;
  direction: GestureDirection | null;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  isDirectionLocked: boolean;
};

type MoveEntry = { x: number; y: number; t: number };

const LOCK_THRESHOLD = 10;
const INITIAL: GestureState = {
  isGesturing: false, direction: null,
  startX: 0, startY: 0, currentX: 0, currentY: 0,
  deltaX: 0, deltaY: 0, velocityX: 0, velocityY: 0,
  isDirectionLocked: false,
};

// ── Hook ─────────────────────────────────────────────────
export function useGestureState() {
  const [gesture, setGesture] = useState<GestureState>(INITIAL);
  const historyRef = useRef<MoveEntry[]>([]);

  const startGesture = useCallback((x: number, y: number) => {
    historyRef.current = [{ x, y, t: Date.now() }];
    setGesture({ ...INITIAL, isGesturing: true, startX: x, startY: y, currentX: x, currentY: y });
  }, []);

  const moveGesture = useCallback((x: number, y: number) => {
    const now = Date.now();
    historyRef.current = [...historyRef.current.slice(-2), { x, y, t: now }];

    setGesture((prev) => {
      if (!prev.isGesturing) return prev;
      const deltaX = x - prev.startX;
      const deltaY = y - prev.startY;
      const hist = historyRef.current;
      const oldest = hist[0];
      const dt = Math.max(1, now - oldest.t);
      const velocityX = (x - oldest.x) / dt;
      const velocityY = (y - oldest.y) / dt;

      let { direction, isDirectionLocked } = prev;
      if (!isDirectionLocked && (Math.abs(deltaX) > LOCK_THRESHOLD || Math.abs(deltaY) > LOCK_THRESHOLD)) {
        isDirectionLocked = true;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
      }
      return { ...prev, currentX: x, currentY: y, deltaX, deltaY, velocityX, velocityY, direction, isDirectionLocked };
    });
  }, []);

  const endGesture = useCallback(() => {
    setGesture((prev) => ({ ...prev, isGesturing: false }));
    historyRef.current = [];
  }, []);

  const resetGesture = useCallback(() => {
    setGesture(INITIAL);
    historyRef.current = [];
  }, []);

  return { gesture, startGesture, moveGesture, endGesture, resetGesture };
}
