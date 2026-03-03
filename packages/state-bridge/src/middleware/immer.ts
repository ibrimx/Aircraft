import { produce } from 'immer'
import type { StateCreator, StoreMutatorIdentifier } from 'zustand'

type Immer = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  initializer: StateCreator<T, [...Mps, ['zustand/immer', never]], Mcs>
) => StateCreator<T, Mps, [['zustand/immer', never], ...Mcs]>

declare module 'zustand' {
  interface StoreMutators<S, A> {
    ['zustand/immer']: WithImmer<S>
  }
}

type WithImmer<S> = Write<S, StoreImmer<S>>
type Write<T, U> = Omit<T, keyof U> & U
type StoreImmer<S> = S extends { getState: () => infer T }
  ? { setState: SetStateWithImmer<T> }
  : never
type SetStateWithImmer<T> = (
  fn: T | Partial<T> | ((draft: T) => void | T)
) => void

export const immer: Immer =
  (initializer) => (set, get, store) => {
    type T = ReturnType<typeof initializer>
    const immerSet: typeof set = (fn) => {
      if (typeof fn === 'function') {
        set(produce(fn as (draft: T) => void) as T | Partial<T>)
      } else {
        set(fn)
      }
    }
    store.setState = immerSet
    return initializer(immerSet, get, store)
  }
