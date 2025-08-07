import { useCallback, useEffect, useState, useRef } from 'react';
import { Series, APIError } from '@/types';
import {
  fetchSeriesByPage,
  searchSeriesByName,
  SeriesServiceError,
} from '@/services/seriesService';

interface UseSeriesDataReturn {
  series: Series[];
  loading: boolean;
  error: APIError | null;
  searchTerm: string;
  hasMore: boolean;
  setSearchTerm: (term: string) => void;
  setDebouncedSearchTerm: (term: string) => void;
  loadMoreSeries: () => Promise<void>;
  refreshSeries: () => Promise<void>;
  refreshOnFocus: () => Promise<void>;
}

export function useSeriesData(): UseSeriesDataReturn {
  const [series, setSeries] = useState<Series[]>([]);
  const [allSearchResults, setAllSearchResults] = useState<Series[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchDisplayed, setSearchDisplayed] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const searchRequestRef = useRef<boolean>(false);
  const loadRequestRef = useRef<boolean>(false);
  const seriesRef = useRef<Series[]>([]);
  const searchTermRef = useRef<string>('');

  useEffect(() => {
    seriesRef.current = series;
  }, [series]);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  const isSearchMode = searchTerm.trim() !== '';
  const PAGE_SIZE = 20;

  const loadMoreSeries = useCallback(async () => {
    if (loading || !hasMore || loadRequestRef.current) return;

    loadRequestRef.current = true;
    setLoading(true);
    setError(null);

    try {
      if (isSearchMode) {
        const nextBatch = allSearchResults.slice(
          searchDisplayed,
          searchDisplayed + PAGE_SIZE
        );
        if (nextBatch.length > 0) {
          setSeries((prev) => [...prev, ...nextBatch]);
          setSearchDisplayed((prev) => prev + nextBatch.length);
          if (searchDisplayed + nextBatch.length >= allSearchResults.length) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } else {
        const newSeries = await fetchSeriesByPage(page);
        if (newSeries.length === 0) {
          setHasMore(false);
        } else {
          setSeries((prev) => [...prev, ...newSeries]);
          setPage((prev) => prev + 1);
        }
      }
    } catch (err) {
      const apiError: APIError =
        err instanceof SeriesServiceError
          ? { message: err.message, status: err.status }
          : { message: 'Failed to load series' };
      setError(apiError);
    } finally {
      setLoading(false);
      loadRequestRef.current = false;
    }
  }, [
    loading,
    hasMore,
    isSearchMode,
    allSearchResults,
    searchDisplayed,
    page,
    PAGE_SIZE,
  ]);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (searchRequestRef.current) {
        return;
      }

      if (!searchQuery.trim() && searchTerm.trim() !== '') {
        setSeries([]);
        setAllSearchResults([]);
        setPage(0);
        setHasMore(true);
        setSearchDisplayed(0);
        setError(null);
        searchRequestRef.current = false;
        return;
      }

      searchRequestRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchSeriesByName(searchQuery);

        if (searchRequestRef.current) {
          setAllSearchResults(searchResults);

          const firstBatch = searchResults.slice(0, PAGE_SIZE);
          setSeries(firstBatch);
          setSearchDisplayed(firstBatch.length);
          setHasMore(searchResults.length > firstBatch.length);
        }
      } catch (err) {
        if (searchRequestRef.current) {
          const apiError: APIError =
            err instanceof SeriesServiceError
              ? { message: err.message, status: err.status }
              : { message: 'Failed to search series' };
          setError(apiError);
        }
      } finally {
        if (searchRequestRef.current) {
          setLoading(false);
          searchRequestRef.current = false;
        }
      }
    },
    [PAGE_SIZE, searchTerm]
  );

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleDebouncedSearch = useCallback(
    (term: string) => {
      handleSearch(term);
    },
    [handleSearch]
  );

  const refreshSeries = useCallback(async () => {
    setSeries([]);
    setAllSearchResults([]);
    setPage(0);
    setHasMore(true);
    setSearchDisplayed(0);
    setError(null);
    setSearchTerm('');

    setLoading(true);
    try {
      const newSeries = await fetchSeriesByPage(0);
      if (newSeries.length > 0) {
        setSeries(newSeries);
        setPage(1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      const apiError: APIError =
        err instanceof SeriesServiceError
          ? { message: err.message, status: err.status }
          : { message: 'Failed to load series' };
      setError(apiError);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshOnFocus = useCallback(async () => {
    if (searchTermRef.current.trim() === '' && seriesRef.current.length === 0) {
      setLoading(true);
      setError(null);
      try {
        const newSeries = await fetchSeriesByPage(0);
        if (newSeries.length > 0) {
          setSeries(newSeries);
          setPage(1);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        const apiError: APIError =
          err instanceof SeriesServiceError
            ? { message: err.message, status: err.status }
            : { message: 'Failed to load series' };
        setError(apiError);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      loadMoreSeries();
    }
  }, [initialized, loadMoreSeries]);

  return {
    series,
    loading,
    error,
    searchTerm,
    hasMore,
    setSearchTerm: handleSetSearchTerm,
    setDebouncedSearchTerm: handleDebouncedSearch,
    loadMoreSeries,
    refreshSeries,
    refreshOnFocus,
  };
}
