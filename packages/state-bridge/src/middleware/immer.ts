import { produce } from 'immer'
import type { StateCreator, StoreMutatorIdentifier } from 'zustand'

/**
 * Minimal immer middleware for zustand v5.
 * Avoids module augmentation to prevent duplicate declaration conflicts.
 */
type Immer = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  initializer: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, [['zustand/immer', never], ...Mcs]>

type SetStateWithImmer<T> = (
  next:
    | T
    | Partial<T>
    | ((draft: T) => void | T | Partial<T>),
  replace?: boolean
) => void

export const immer: Immer =
  (initializer) => (set, get, store) => {
    const setImmer: SetStateWithImmer<ReturnType<typeof get>> = (next, replace) => {
      if (typeof next === 'function') {
        const updater = produce(next as (draft: ReturnType<typeof get>) => void | any)
        ;(set as any)(updater, replace)
        return
      }

      ;(set as any)(next, replace)
    }

    // Patch store.setState as well (optional but practical)
    ;(store as any).setState = setImmer

    return initializer(setImmer as any, get, store)
  }
