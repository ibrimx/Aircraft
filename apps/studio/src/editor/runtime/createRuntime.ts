import type { RuntimeState } from '../state/runtimeState'
import type { RuntimeAction } from '../state/actions'
import { runtimeReducer } from '../state/reducer'

/**
 * Minimal runtime: getState/dispatch/subscribe
 *
 * R1 ✅ single source of truth
 * R2 ✅ typed dispatch
 * R6 ✅ supports granular subscriptions
 */

export type Unsubscribe = () => void
export type Listener = (state: RuntimeState) => void

export type EditorRuntime = {
  getState: () => RuntimeState
  dispatch: (action: RuntimeAction) => void
  subscribe: (listener: Listener) => Unsubscribe
}

export function createRuntime(initial: RuntimeState): EditorRuntime {
  let state = initial
  const listeners = new Set<Listener>()

  return {
    getState: () => state,
    dispatch: (action) => {
      const next = runtimeReducer(state, action)
      if (next === state) return
      state = next
      for (const l of listeners) l(state)
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
