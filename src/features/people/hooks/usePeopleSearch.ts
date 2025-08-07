import { useState, useEffect } from 'react';
import { Person, APIError } from '@/types';
import { searchPeople, PeopleServiceError } from '@/services/peopleService';

export function usePeopleSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setPeople([]);
      setError(null);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchPeople(query);
      setPeople(results);
      setHasSearched(true);
    } catch (err) {
      const apiError: APIError =
        err instanceof PeopleServiceError
          ? { message: err.message, status: err.status }
          : { message: 'Failed to search people' };
      setError(apiError);
      setPeople([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const retrySearch = () => {
    handleSearch(searchQuery);
  };

  const resetSearch = () => {
    setSearchQuery('');
    setPeople([]);
    setError(null);
    setHasSearched(false);
    setLoading(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    people,
    loading,
    error,
    hasSearched,
    retrySearch,
    resetSearch,
  };
}
