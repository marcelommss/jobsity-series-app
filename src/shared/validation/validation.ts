/**
 * Validation utility functions for the application
 */

export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPin = (pin: string): boolean => {
  if (!pin || typeof pin !== 'string') return false;
  return pin.length >= 4 && pin.length <= 8 && /^\d+$/.test(pin);
};

export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  if (maxLength <= 3) return '';
  return text.substring(0, maxLength - 3).trim() + '...';
};

export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString(locale);
  } catch {
    return '';
  }
};