import { Person, PersonSearchResult, CastCredit } from '@/types';

const BASE_URL = 'https://api.tvmaze.com';

export class PeopleServiceError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'PeopleServiceError';
    this.status = status;
  }
}

export const searchPeople = async (query: string): Promise<Person[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/people?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new PeopleServiceError(
        `Failed to search people: ${response.statusText}`,
        response.status
      );
    }

    const data: PersonSearchResult[] = await response.json();

    return data.map(({ person }) => person);
  } catch (error) {
    if (error instanceof PeopleServiceError) {
      throw error;
    }

    throw new PeopleServiceError(
      'Network error occurred while searching people'
    );
  }
};

export const fetchPersonById = async (id: number): Promise<Person> => {
  try {
    const response = await fetch(`${BASE_URL}/people/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new PeopleServiceError('Person not found', 404);
      }
      throw new PeopleServiceError(
        `Failed to fetch person: ${response.statusText}`,
        response.status
      );
    }

    const person: Person = await response.json();
    return person;
  } catch (error) {
    if (error instanceof PeopleServiceError) {
      throw error;
    }

    throw new PeopleServiceError(
      'Network error occurred while fetching person'
    );
  }
};

export const getPersonCastCredits = async (
  id: number
): Promise<CastCredit[]> => {
  try {
    const response = await fetch(`${BASE_URL}/people/${id}/castcredits`);

    if (!response.ok) {
      throw new PeopleServiceError(
        `Failed to fetch cast credits: ${response.statusText}`,
        response.status
      );
    }

    const credits = await response.json();
    return credits;
  } catch (error) {
    if (error instanceof PeopleServiceError) {
      throw error;
    }

    throw new PeopleServiceError(
      'Network error occurred while fetching cast credits'
    );
  }
};
