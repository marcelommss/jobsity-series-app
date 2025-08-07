/**
 * Series formatting utility functions
 * Extracted from series components for better testability
 */

export const formatYear = (premiered: string | null | undefined): string => {
  if (!premiered) return '';
  try {
    const year = new Date(premiered).getFullYear();
    if (isNaN(year)) return '';
    return year.toString();
  } catch {
    return '';
  }
};

export const formatRating = (rating: { average: number | null } | null | undefined): string => {
  if (!rating?.average) return '';
  return rating.average.toFixed(1);
};

export const formatGenres = (genres: string[] | null | undefined, maxCount: number = 3): string => {
  if (!genres || genres.length === 0) return '';
  return genres.slice(0, maxCount).join(' • ');
};

export const getStatusColor = (status: string | null | undefined): 'error' | 'success' | 'default' => {
  if (!status) return 'default';
  if (status === 'Ended') return 'error';
  if (status === 'Running') return 'success';
  return 'default';
};