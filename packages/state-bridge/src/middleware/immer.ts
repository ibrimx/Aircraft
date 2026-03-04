import { produce } from 'immer'
import type {
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
} from 'zustand'

/**
 * Zustand v5 immer middleware (typed)
 */
type Immer = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  initializer: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, [['zustand/immer', never], ...Mcs]>

declare module 'zustand' {
  interface StoreMutators<S, A> {
    ['zustand/immer']: WithImmer<S>
  }
}

type WithImmer<S> = S extends StoreApi<infer T>
  ? Omit<S, 'setState'> & {
      setState: SetStateWithImmer<T>
    }
  : never

type SetStateWithImmer<T> = (
  next:
    | T
    | Partial<T>
    | ((draft: T) => void | T | Partial<T>),
  replace?: boolean
) => void

export const immer: Immer =
  (initializer) => (set, get, store) => {
    const setImmer: typeof set = (next: any, replace?: boolean) => {
      if (typeof next === 'function') {
        // next(draft) style
        const updater = produce(next as (draft: any) => void | any)
        return set(updater as any, replace)
      }
      // partial / full state
      return set(next, replace)
    }

    // Important: patch store.setState so external callers can also use draft fn
    ;(store as unknown as { setState: SetStateWithImmer<any> }).setState =
      setImmer as unknown as SetStateWithImmer<any>

    return initializer(setImmer, get, store)
  }
