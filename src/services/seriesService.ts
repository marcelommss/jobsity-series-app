import { Series, APIError } from '@/types';
import {
  SeriesArraySchema,
  SearchResultsSchema,
  SeriesSchema,
} from '@/shared/schemas';

const BASE_URL = 'https://api.tvmaze.com';

class SeriesServiceError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'SeriesServiceError';
  }
}

export async function fetchSeriesByPage(page: number): Promise<Series[]> {
  try {
    const response = await fetch(`${BASE_URL}/shows?page=${page}`);

    if (!response.ok) {
      throw new SeriesServiceError(
        `Error fetching series (page ${page}): ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    const validatedData = SeriesArraySchema.parse(data);
    return validatedData;
  } catch (error) {
    if (error instanceof SeriesServiceError) {
      throw error;
    }
    throw new SeriesServiceError('Failed to fetch series data');
  }
}

export async function searchSeriesByName(name: string): Promise<Series[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/shows?q=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
      throw new SeriesServiceError(
        `Error searching series: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    const validatedData = SearchResultsSchema.parse(data);
    return validatedData.map((item) => item.show);
  } catch (error) {
    if (error instanceof SeriesServiceError) {
      throw error;
    }
    throw new SeriesServiceError('Failed to search series');
  }
}

export async function fetchSeriesById(id: number): Promise<Series> {
  try {
    const response = await fetch(`${BASE_URL}/shows/${id}`);

    if (!response.ok) {
      throw new SeriesServiceError(
        `Error fetching series details: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    const validatedData = SeriesSchema.parse(data);
    return validatedData;
  } catch (error) {
    if (error instanceof SeriesServiceError) {
      throw error;
    }
    throw new SeriesServiceError('Failed to fetch series details');
  }
}


export { SeriesServiceError };
