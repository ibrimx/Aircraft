// P65 — orientation-layout.tsx
import { type ReactNode, type CSSProperties, useMemo } from 'react';
import { useOrientation } from './orientation-handler';

/* ── Types ─────────────────────────────────────────────── */

export type OrientationLayoutProps = {
  children: ReactNode;
  portrait?: CSSProperties;
  landscape?: CSSProperties;
};

/* ── Component ─────────────────────────────────────────── */

export function OrientationLayout(props: OrientationLayoutProps) {
  const { children, portrait = {}, landscape = {} } = props;
  const { orientation } = useOrientation();

  const style: CSSProperties = useMemo(
    () => (orientation === 'portrait' ? portrait : landscape),
    [orientation, portrait, landscape],
  );

  return <div style={style}>{children}</div>;
}
