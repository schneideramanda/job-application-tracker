import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeDBEntry(entry: unknown) {
  return JSON.parse(JSON.stringify(entry));
}

export function formatFormTags(tags: string): string[] {
  return tags
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
}
