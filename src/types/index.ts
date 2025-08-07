export interface Series {
  id: number;
  name: string;
  image?: {
    medium: string;
    original: string;
  } | null;
  genres?: string[] | null;
  premiered?: string | null;
  summary?: string | null;
  schedule?: {
    time: string;
    days: string[];
  } | null;
  status?: string | null;
  rating?: {
    average: number | null;
  } | null;
  network?: {
    name: string;
    country: {
      name: string;
      code: string;
    };
  } | null;
}

export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  summary?: string | null;
  image?: {
    medium: string;
    original: string;
  } | null;
  airdate?: string | null;
  runtime?: number | null;
}

export interface SeasonEpisodes {
  season: number;
  episodes: Episode[];
}

export interface APIError {
  message: string;
  status?: number;
}

export interface PaginationState {
  page: number;
  hasMore: boolean;
  loading: boolean;
}
