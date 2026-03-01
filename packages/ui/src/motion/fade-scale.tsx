/**
 * @file fade-scale.tsx
 * @package @brimair/ui
 * @description FadeScale — fade + scale enter/exit animation component.
 * Uses spring presets. Respects prefers-reduced-motion.
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { getSpring, prefersReducedMotion } from './presets';
import type { SpringPresetKey } from './presets';

export interface FadeScaleProps {
  children: ReactNode;
  /** Spring preset key @default 'smooth' */
  spring?: SpringPresetKey;
  /** Scale origin value @default 0.95 */
  fromScale?: number;
  className?: string;
}

export const FadeScale = ({
  children,
  spring = 'smooth',
  fromScale = 0.95,
  className,
}: FadeScaleProps): JSX.Element => {
  const reduced = prefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: reduced ? 1 : fromScale }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reduced ? 1 : fromScale }}
      transition={getSpring(spring)}
    >
      {children}
    </motion.div>
  );
};
