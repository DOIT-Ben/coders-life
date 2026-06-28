import { numberFrom, tagsFrom } from './realworldParser';

export interface NumericRange {
  min: number;
  max: number;
}

export function rangeFrom(value: string | undefined): NumericRange {
  const text = value ?? '';
  const [left, right] = text.split('-').map(item => numberFrom(item));
  if (!right) return { min: left, max: left };
  return { min: Math.min(left, right), max: Math.max(left, right) };
}

export function listFrom(value: string | undefined): string[] {
  return tagsFrom(value);
}
