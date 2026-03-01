/**
 * @file animated-presence.tsx
 * @package @brimair/ui
 * @description Thin wrapper around Framer Motion AnimatePresence.
 * Provides a consistent `mode` default across Brimair.
 */

import { AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

export type AnimatedPresenceMode = 'sync' | 'wait' | 'popLayout';

export interface AnimatedPresenceWrapperProps {
  children: ReactNode;
  /** @default 'wait' */
  mode?: AnimatedPresenceMode;
  initial?: boolean;
}

export const AnimatedPresenceWrapper = ({
  children,
  mode = 'wait',
  initial = false,
}: AnimatedPresenceWrapperProps): JSX.Element => (
  <AnimatePresence mode={mode} initial={initial}>
    {children}
  </AnimatePresence>
);
