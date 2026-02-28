/**
 * Primitive color palette for Brimair design tokens.
 * Values sourced from Design System Guide §2.
 * @see PALETTE — single source of truth for all raw color values.
 */

/** Complete color palette — all raw HEX values used across themes. */
export const PALETTE = {
  gray: {
    50: '#FAFAFA', 100: '#F5F5F5', 200: '#E5E5E5', 300: '#D4D4D4',
    400: '#A3A3A3', 500: '#737373', 600: '#525252', 700: '#404040',
    800: '#262626', 900: '#171717', 950: '#0A0A0A',
  },
  blue: {
    50: '#E6F4FF', 100: '#BAE0FF', 200: '#8ECCFF', 300: '#62B8FF',
    400: '#36A4FF', 500: '#0099FF', 600: '#0088E6', 700: '#0077CC',
    800: '#0060A3', 900: '#004A7A', 950: '#003357',
  },
  red: {
    50: '#FFF1F1', 100: '#FFD6D6', 200: '#FFB3B3', 300: '#FF8F8F',
    400: '#FF6B6B', 500: '#FF4444', 600: '#E63E3E', 700: '#CC3636',
    800: '#A32B2B', 900: '#7A2020', 950: '#571717',
  },
  green: {
    50: '#EDFCF1', 100: '#C9F5D5', 200: '#A0EDBA', 300: '#77E49F',
    400: '#53DC86', 500: '#30D158', 600: '#2BBD4F', 700: '#26A846',
    800: '#1F863A', 900: '#17652C', 950: '#10441E',
  },
  yellow: {
    50: '#FFFCE6', 100: '#FFF6B3', 200: '#FFF080', 300: '#FFE94D',
    400: '#FFE01A', 500: '#FFD60A', 600: '#E6C009', 700: '#CCAB08',
    800: '#A38906', 900: '#7A6705', 950: '#574903',
  },
  purple: {
    50: '#F5F0FF', 100: '#E0D4FF', 200: '#CBB8FF', 300: '#B69CFF',
    400: '#A180FF', 500: '#8C65FF', 600: '#7D5BE6', 700: '#6F51CC',
    800: '#5940A3', 900: '#43307A', 950: '#2D2057',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const

/** A top-level key of {@link PALETTE}. */
export type PaletteColor = keyof typeof PALETTE

/** Numeric step within a palette color scale. */
export type PaletteStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
