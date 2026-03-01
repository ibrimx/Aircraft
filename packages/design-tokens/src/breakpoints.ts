import type { BreakpointName, BreakpointConfig } from '@aircraft/shared-types'

export const BREAKPOINTS: Record<BreakpointName, BreakpointConfig> = {
  mobile:  { name: 'mobile',  minWidth: 0,    maxWidth: 767  },
  tablet:  { name: 'tablet',  minWidth: 768,  maxWidth: 1023 },
  desktop: { name: 'desktop', minWidth: 1024, maxWidth: 1439 },
  wide:    { name: 'wide',    minWidth: 1440, maxWidth: null },
}

export const BREAKPOINT_VALUES = { mobile: 0, tablet: 768, desktop: 1024, wide: 1440 } as const

export function mediaQuery(bp: BreakpointName): string {
  return `(min-width: ${BREAKPOINT_VALUES[bp]}px)`
}

export function mediaQueryRange(bp: BreakpointName): string {
  const min = BREAKPOINT_VALUES[bp]
  const config = BREAKPOINTS[bp]
  if (config.maxWidth === null) {
    return `(min-width: ${min}px)`
  }
  return `(min-width: ${min}px) and (max-width: ${config.maxWidth}px)`
}
