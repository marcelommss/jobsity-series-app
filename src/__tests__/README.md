# Test Suite Documentation

This directory contains comprehensive unit tests for the Jobsity Series App.

## Test Structure

```
src/
├── __tests__/
│   ├── setup.ts                 # Test setup and mocks
│   └── README.md               # This documentation
├── shared/
│   └── __tests__/
│       ├── utils.test.ts       # Utility function tests
│       └── cn.test.ts          # Class name utility tests
├── services/
│   └── __tests__/
│       └── seriesService.test.ts # API service tests
├── features/
│   ├── series/
│   │   ├── __tests__/
│   │   │   ├── HomeScreen.test.tsx     # Main screen component tests
│   │   │   └── SeriesCard.test.tsx     # Series card component tests
│   │   ├── hooks/
│   │   │   └── __tests__/
│   │   │       └── useSeriesData.test.tsx # Series data hook tests
│   │   └── components/
│   │       └── __tests__/
│   │           ├── SeriesSearchInput.test.tsx # Search input tests
│   │           └── SeriesList.test.tsx        # Series list tests
│   └── episodes/
│       ├── services/
│       │   └── __tests__/
│       │       └── episodesService.test.ts # Episodes API service tests
│       ├── hooks/
│       │   └── __tests__/
│       │       └── useEpisodes.test.tsx    # Episodes hook tests
│       └── components/
│           └── __tests__/
│               └── EpisodesList.test.tsx   # Episodes list component tests
└── shared/
    └── components/
        └── __tests__/
            └── ErrorMessage.test.tsx       # Error message component tests
```

## Test Coverage

### Utility Functions
- ✅ `debounce` function with various timing scenarios
- ✅ `cn` class name merging utility with Tailwind classes

### Services
- ✅ `seriesService` - API calls for series data
  - Fetch series by page
  - Search series by name  
  - Fetch series by ID
  - Error handling and network failures
- ✅ `episodesService` - API calls for episodes data
  - Fetch episodes for a series
  - Error handling

### Custom Hooks
- ✅ `useSeriesData` - Series data management
  - Initial loading
  - Pagination
  - Search functionality
  - Error states
  - Refresh functionality
- ✅ `useEpisodes` - Episodes data management
  - Loading episodes by series ID
  - Grouping by season
  - Error handling

### Components
- ✅ `HomeScreen` - Main application screen
  - Different states (loading, error, data)
  - Integration with hooks
- ✅ `SeriesCard` - Individual series display
  - Series information rendering
  - Navigation on press
  - Handling missing data
- ✅ `SeriesSearchInput` - Search functionality
  - Text input handling
  - Debounced search
  - Clear functionality
  - Focus states
- ✅ `SeriesList` - Series list display  
  - FlatList integration
  - Loading states
  - Pagination handling
- ✅ `EpisodesList` - Episodes display
  - Grouped by seasons
  - Episode navigation
  - Error and empty states
- ✅ `ErrorMessage` - Error display
  - Error message rendering
  - Retry functionality

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

## Test Configuration

- **Framework**: Jest with React Native Testing Library
- **Mocks**: Expo Router, React Native components, API calls
- **Coverage**: Configured to exclude test files and type definitions
- **Path mapping**: `@/*` aliases configured for imports

## Test Best Practices

1. **Mocking**: External dependencies (router, APIs) are properly mocked
2. **Coverage**: All critical paths and edge cases are tested
3. **Isolation**: Tests are independent and don't rely on external state
4. **Assertions**: Clear and specific assertions for behavior verification
5. **Error Handling**: Both success and failure scenarios are covered

## Mock Strategy

- **Expo Router**: Mocked for navigation testing
- **API Calls**: `fetch` is mocked for service testing
- **React Native Components**: Safe area and font loading mocked
- **External Libraries**: Lucide icons and other dependencies mocked

## Coverage Goals

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90% 
- **Lines**: >90%

All core application logic, error paths, and user interactions are thoroughly tested.