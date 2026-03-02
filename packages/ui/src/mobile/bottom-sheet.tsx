// P48
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useThemeTokens } from '@aircraft/design-tokens';
import { Z_INDEX } from '@aircraft/design-tokens';
import {
  cssTransition,
  DURATION,
  EASING,
  MOBILE_TOUCH_TARGET,
  MOBILE_REDUCED_MOTION,
} from '@aircraft/design-tokens';
import { GlassPanel } from '@aircraft/ui';

type BottomSheetSnapPoint = number; /* 0–1 fraction of viewport height */

interface BottomSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly snapPoints?: readonly BottomSheetSnapPoint[];
  readonly initialSnap?: number;
  readonly children: ReactNode;
  readonly backdrop?: boolean;
  readonly handle?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
}

const DISMISS_VELOCITY = 500;
/* gentle spring open ~ cubic-bezier(0.12, 0.8, 0.32, 1) */
const CURVE_OPEN = '0.12, 0.8, 0.32, 1';
/* stiff spring close ~ cubic-bezier(0.32, 0.0, 0.67, 0.0) */
const CURVE_CLOSE = '0.32, 0.0, 0.67, 0.0';

export function BottomSheet({
  open,
  onClose,
  snapPoints = [0.25, 0.5, 0.9],
  initialSnap = 1,
  children,
  backdrop = true,
  handle = true,
  className,
  style,
}: BottomSheetProps) {
  const tokens = useThemeTokens();
  const [snap, setSnap] = useState(initialSnap);
  const [ty, setTy] = useState(100);
  const [isClosing, setIsClosing] = useState(false);
  const drag = useRef({ y: 0, t: 0, on: false });

  useEffect(() => {
    if (open) {
      setIsClosing(false);
      setSnap(initialSnap);
      setTy((1 - snapPoints[initialSnap]) * 100);
      document.body.style.overflow = 'hidden';
    } else {
      setIsClosing(true);
      setTy(100);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, initialSnap, snapPoints]);

  const nearest = useCallback(
    (f: number) => {
      let b = 0;
      for (let i = 1; i < snapPoints.length; i++) {
        if (Math.abs(snapPoints[i] - f) < Math.abs(snapPoints[b] - f)) b = i;
      }
      return b;
    },
    [snapPoints],
  );

  const onDown = useCallback((e: React.PointerEvent) => {
    drag.current = { y: e.clientY, t: Date.now(), on: true };
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current.on) return;
      const dy = e.clientY - drag.current.y;
      const base = (1 - snapPoints[snap]) * 100;
      setTy(Math.max(0, base + (dy / window.innerHeight) * 100));
    },
    [snap, snapPoints],
  );

  const onUp = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current.on) return;
      drag.current.on = false;
      const dy = e.clientY - drag.current.y;
      const dt = Math.max(1, Date.now() - drag.current.t) / 1000;
      if (dy / dt > DISMISS_VELOCITY) { onClose(); return; }
      const f = snapPoints[snap] - dy / window.innerHeight;
      if (f <= 0.05) { onClose(); return; }
      const idx = nearest(f);
      setSnap(idx);
      setTy((1 - snapPoints[idx]) * 100);
    },
    [snap, snapPoints, onClose, nearest],
  );

  if (!open && ty >= 100) return null;

  const noMotion = MOBILE_REDUCED_MOTION;
  const curve = isClosing ? CURVE_CLOSE : CURVE_OPEN;

  const overlayCSS: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: Z_INDEX.overlay,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  };

  const bdCSS: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: tokens.color.overlay,
    transition: noMotion
      ? 'none'
      : cssTransition('opacity', DURATION.normal, EASING.easeInOut),
  };

  const sheetCSS: CSSProperties = {
    position: 'relative',
    inlineSize: '100%',
    maxBlockSize: '95vh',
    borderStartStartRadius: tokens.radius.xl,
    borderStartEndRadius: tokens.radius.xl,
    transform: `translateY(${ty}%)`,
    transition:
      drag.current.on || noMotion
        ? 'none'
        : `transform 0.38s cubic-bezier(${curve})`,
    touchAction: 'none',
    overflow: 'hidden',
    ...style,
  };

  const hWrap: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minBlockSize: MOBILE_TOUCH_TARGET.minSize,
    cursor: 'grab',
  };

  const hBar: CSSProperties = {
    inlineSize: 36,
    blockSize: 4,
    borderRadius: 2,
    background: tokens.color.border,
  };

  const scrollCSS: CSSProperties = { overflowY: 'auto', flex: 1 };

  return createPortal(
    <div style={overlayCSS} onPointerMove={onMove} onPointerUp={onUp}>
      {backdrop && <div style={bdCSS} onClick={onClose} />}
      <GlassPanel
        radius="xl"
        className={className}
        style={sheetCSS}
        onPointerDown={onDown}
      >
        {handle && (
          <div style={hWrap}>
            <div style={hBar} />
          </div>
        )}
        <div style={scrollCSS}>{children}</div>
      </GlassPanel>
    </div>,
    document.body,
  );
}

export type { BottomSheetSnapPoint, BottomSheetProps };
