import type { ISODateString } from '@aircraft/shared-types'

export function toISODateString(date: Date): ISODateString {
  return date.toISOString() as ISODateString
}

export function asISODateString(value: string): ISODateString {
  return value as ISODateString
}
