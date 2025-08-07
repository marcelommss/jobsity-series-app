/**
 * Utility functions for person-related operations
 * Extracted from PersonCard component for testability
 */

export const formatAge = (birthday: string | null, deathday: string | null = null): string | null => {
  if (!birthday) return null;

  try {
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) return null;
    
    const endDate = deathday ? new Date(deathday) : new Date();
    if (deathday && isNaN(endDate.getTime())) return null;
    
    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
      age = age - 1;
    }

    if (deathday) {
      return `${age} (${birthDate.getFullYear()}-${endDate.getFullYear()})`;
    }

    return `${age} years old`;
  } catch {
    return null;
  }
};

export const createPersonRouterParams = (person: any) => {
  const { id, name, image, country, birthday, deathday, gender } = person;
  return {
    id: id.toString(),
    name,
    image: image?.medium || '',
    country: country?.name || '',
    birthday: birthday || '',
    deathday: deathday || '',
    gender: gender || '',
  };
};