// P49
import { useCallback, type CSSProperties } from 'react';
import { cssTransition, DURATION, EASING, MOBILE_REDUCED_MOTION } from '@aircraft/design-tokens';
import { Z_INDEX } from '@aircraft/design-tokens';

export interface BottomSheetBackdropProps {
  readonly visible: boolean;
  readonly onTap: () => void;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function BottomSheetBackdrop({
  visible,
  onTap,
  className,
  style,
}: BottomSheetBackdropProps) {
  const noMotion = MOBILE_REDUCED_MOTION;

  const handleClick = useCallback(() => {
    if (visible) onTap();
  }, [visible, onTap]);

  const backdropCSS: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: Z_INDEX.overlay - 1,
    background: 'rgba(0,0,0,0.5)',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: noMotion
      ? 'none'
      : cssTransition('opacity', DURATION.fast, EASING.easeOut),
    ...style,
  };

  return (
    <div
      className={className}
      style={backdropCSS}
      onClick={handleClick}
      aria-hidden={!visible}
    />
  );
}
