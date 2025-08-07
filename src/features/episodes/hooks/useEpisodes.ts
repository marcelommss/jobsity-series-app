import { useCallback, useEffect, useState } from 'react';
import { Episode, SeasonEpisodes, APIError } from '@/types';
import { fetchSeriesEpisodes, EpisodesServiceError } from '../services/episodesService';

interface UseEpisodesReturn {
  episodes: SeasonEpisodes[];
  loading: boolean;
  error: APIError | null;
  refreshEpisodes: () => Promise<void>;
}

export function useEpisodes(seriesId: number): UseEpisodesReturn {
  const [episodes, setEpisodes] = useState<SeasonEpisodes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const loadEpisodes = useCallback(async () => {
    if (!seriesId) return;

    setLoading(true);
    setError(null);

    try {
      const episodesData = await fetchSeriesEpisodes(seriesId);

      // Group episodes by season
      const episodesBySeason = episodesData.reduce((acc, episode) => {
        const seasonIndex = acc.findIndex(s => s.season === episode.season);
        if (seasonIndex >= 0) {
          acc[seasonIndex].episodes.push(episode);
        } else {
          acc.push({ season: episode.season, episodes: [episode] });
        }
        return acc;
      }, [] as SeasonEpisodes[]);

      // Sort seasons and episodes
      episodesBySeason.sort((a, b) => a.season - b.season);
      episodesBySeason.forEach(season => {
        season.episodes.sort((a, b) => a.number - b.number);
      });

      setEpisodes(episodesBySeason);
    } catch (err) {
      const apiError: APIError = err instanceof EpisodesServiceError
        ? { message: err.message, status: err.status }
        : { message: 'Failed to load episodes' };
      setError(apiError);
    } finally {
      setLoading(false);
    }
  }, [seriesId]);

  const refreshEpisodes = useCallback(async () => {
    await loadEpisodes();
  }, [loadEpisodes]);

  useEffect(() => {
    loadEpisodes();
  }, [loadEpisodes]);

  return {
    episodes,
    loading,
    error,
    refreshEpisodes,
  };
}