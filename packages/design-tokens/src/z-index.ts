export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  panel: 1200,
  nav: 1100,
  toolbar: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
  max: 9999,
} as const

export type ZIndexKey = keyof typeof Z_INDEX
