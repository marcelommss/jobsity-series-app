import { useState, useEffect } from 'react';
import { Person, CastCredit, APIError } from '@/types';
import { fetchPersonById, getPersonCastCredits, PeopleServiceError } from '@/services/peopleService';

export function usePersonDetails(personId: number) {
  const [person, setPerson] = useState<Person | null>(null);
  const [castCredits, setCastCredits] = useState<CastCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  const fetchPersonDetails = async () => {
    if (!personId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch person details and cast credits in parallel
      const [personData, creditsData] = await Promise.all([
        fetchPersonById(personId),
        getPersonCastCredits(personId)
      ]);

      setPerson(personData);
      setCastCredits(creditsData);
    } catch (err) {
      const apiError: APIError = err instanceof PeopleServiceError
        ? { message: err.message, status: err.status }
        : { message: 'Failed to load person details' };
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonDetails();
  }, [personId]);

  const retryFetch = () => {
    fetchPersonDetails();
  };

  return {
    person,
    castCredits,
    loading,
    error,
    retryFetch,
  };
}