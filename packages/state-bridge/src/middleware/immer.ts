import type { StateCreator } from 'zustand'
import { immer as zustandImmer } from 'zustand/middleware/immer'

/**
 * Zustand v5 already ships correct Immer typings via `zustand/middleware/immer`.
 * This module is a thin wrapper to keep the local import path stable.
 *
 * IMPORTANT:
 * - No custom StoreMutators augmentation here (it breaks TS in zustand v5).
 * - No custom mutator identifier wiring.
 */
export type Immer = <
  T,
  // Keep generics flexible to match Zustand's official middleware typing.
  Mps extends unknown[] = [],
  Mcs extends unknown[] = []
>(
  initializer: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>

export const immer: Immer = ((initializer: any) => zustandImmer(initializer)) as Immer
