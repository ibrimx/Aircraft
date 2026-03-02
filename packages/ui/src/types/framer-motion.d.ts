declare module 'framer-motion' {
  import type { ComponentType, ReactNode } from 'react'

  export const AnimatePresence: ComponentType<{ children?: ReactNode; mode?: 'wait' | 'sync' | 'popLayout'; initial?: boolean }>

  export const motion: any

  export function useReducedMotion(): boolean
  export function useMotionValue<T = number>(initial: T): { get(): T; set(v: T): void }
  export function useSpring<T = number>(value: any, config?: Record<string, unknown>): any
  export function useTransform<T = any>(value: any, input: any, output?: any): any
  export function useAnimationControls(): { start: (v: unknown) => Promise<void>; set: (v: unknown) => void }

  export type PanInfo = {
    point: { x: number; y: number }
    delta: { x: number; y: number }
    offset: { x: number; y: number }
    velocity: { x: number; y: number }
  }
}
