import { vi } from './vi';
import { en } from './en';

export type Language = 'vi' | 'en';
export type Content = typeof vi;

export const content: Record<Language, Content> = {
  vi,
  en,
};

