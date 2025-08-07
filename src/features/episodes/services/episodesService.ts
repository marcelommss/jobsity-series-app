import { Episode, APIError } from '@/types';
import { EpisodeArraySchema } from '@/shared/schemas';

const BASE_URL = 'https://api.tvmaze.com';

class EpisodesServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'EpisodesServiceError';
  }
}

/**
 * Fetches all episodes for a specific series.
 *
 * @param seriesId - The series ID.
 * @returns A promise that resolves to an array of episodes.
 * @throws EpisodesServiceError if the request fails.
 */
export async function fetchSeriesEpisodes(seriesId: number): Promise<Episode[]> {
  try {
    const response = await fetch(`${BASE_URL}/shows/${seriesId}/episodes`);
    
    if (!response.ok) {
      throw new EpisodesServiceError(
        `Error fetching episodes: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    const validatedData = EpisodeArraySchema.parse(data);
    return validatedData;
  } catch (error) {
    if (error instanceof EpisodesServiceError) {
      throw error;
    }
    console.error('fetchSeriesEpisodes error:', error);
    throw new EpisodesServiceError('Failed to fetch episodes');
  }
}

export { EpisodesServiceError };