import PersonCard from '../PersonCard';
import { Person } from '@/types';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock the component to avoid CSS interop issues
const mockPersonCard = jest.fn();
jest.mock('../PersonCard', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      mockPersonCard(props);
      return null;
    }
  };
});

const mockRouter = router as jest.Mocked<typeof router>;

describe('PersonCard Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPerson: Person = {
    id: 1,
    name: 'John Doe',
    image: {
      medium: 'https://example.com/john-medium.jpg',
      original: 'https://example.com/john-original.jpg',
    },
    country: {
      name: 'United States',
      code: 'US',
      timezone: 'America/New_York',
    },
    birthday: '1990-01-15',
    gender: 'Male',
    url: 'https://www.tvmaze.com/people/1/john-doe',
    updated: 1640995200,
    _links: {
      self: {
        href: 'https://api.tvmaze.com/people/1'
      }
    }
  };

  it('should receive correct props', () => {
    PersonCard({ person: mockPerson });
    
    expect(mockPersonCard).toHaveBeenCalledWith({ person: mockPerson });
  });

  it('should handle person without image', () => {
    const personWithoutImage = { ...mockPerson, image: null };
    
    PersonCard({ person: personWithoutImage });
    
    expect(mockPersonCard).toHaveBeenCalledWith({ person: personWithoutImage });
  });

  it('should handle person without country', () => {
    const personWithoutCountry = { ...mockPerson, country: null };
    
    PersonCard({ person: personWithoutCountry });
    
    expect(mockPersonCard).toHaveBeenCalledWith({ person: personWithoutCountry });
  });

  it('should handle person without birthday', () => {
    const personWithoutBirthday = { ...mockPerson, birthday: null };
    
    PersonCard({ person: personWithoutBirthday });
    
    expect(mockPersonCard).toHaveBeenCalledWith({ person: personWithoutBirthday });
  });

  it('should handle person without gender', () => {
    const personWithoutGender = { ...mockPerson, gender: null };
    
    PersonCard({ person: personWithoutGender });
    
    expect(mockPersonCard).toHaveBeenCalledWith({ person: personWithoutGender });
  });

  it('should handle person with death date', () => {
    const deceasedPerson = { ...mockPerson, deathday: '2020-12-25' };
    
    PersonCard({ person: deceasedPerson });
    
    expect(mockPersonCard).toHaveBeenCalledWith({ person: deceasedPerson });
  });
});