// P65 — haptic-feedback.ts

/* ── Types ─────────────────────────────────────────────── */

type ImpactStyle = 'light' | 'medium' | 'heavy';
type NotificationType = 'success' | 'warning' | 'error';

export type HapticPattern =
  | { kind: 'impact'; style: ImpactStyle }
  | { kind: 'notification'; type: NotificationType }
  | { kind: 'selection' };

/* ── Helpers ───────────────────────────────────────────── */

function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

const VIBRATION_MAP: Record<ImpactStyle, number> = {
  light: 10,
  medium: 20,
  heavy: 40,
};

const NOTIFICATION_PATTERN: Record<NotificationType, number[]> = {
  success: [10, 30, 10],
  warning: [20, 40, 20],
  error: [40, 30, 40, 30, 40],
};

/* ── Public API ────────────────────────────────────────── */

export function triggerHaptic(pattern: HapticPattern): void {
  if (!canVibrate()) return;
  if (pattern.kind === 'impact') {
    navigator.vibrate(VIBRATION_MAP[pattern.style]);
  } else if (pattern.kind === 'notification') {
    navigator.vibrate(NOTIFICATION_PATTERN[pattern.type]);
  } else {
    navigator.vibrate(5);
  }
}
