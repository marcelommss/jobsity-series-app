// Mock the appearance observables module first
jest.mock('react-native-css-interop/src/runtime/native/appearance-observables', () => ({
  resetAppearanceListeners: jest.fn(),
  addAppearanceListener: jest.fn(),
}));

// Mock the entire CSS Interop runtime system
jest.mock('react-native-css-interop/src/runtime/native/api', () => ({}));
jest.mock('react-native-css-interop/src/runtime/api.native', () => ({}));
jest.mock('react-native-css-interop/src/runtime/wrap-jsx', () => ({}));
jest.mock('react-native-css-interop/src/runtime/jsx-runtime', () => ({}));

// Mock NativeWind and CSS Interop main modules
jest.mock('react-native-css-interop', () => ({
  styled: jest.fn((Component) => Component),
  cssInterop: jest.fn(),
}));

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: jest.fn((Component) => Component),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: ({ children }: { children: React.ReactNode }) => children,
  },
  Tabs: {
    Screen: ({ children }: { children: React.ReactNode }) => children,
  },
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

// Mock expo-font
jest.mock('@expo-google-fonts/host-grotesk', () => ({
  useFonts: () => [true, null],
  HostGrotesk_400Regular: 'HostGrotesk_400Regular',
  HostGrotesk_500Medium: 'HostGrotesk_500Medium',
  HostGrotesk_600SemiBold: 'HostGrotesk_600SemiBold',
  HostGrotesk_700Bold: 'HostGrotesk_700Bold',
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  TvIcon: 'TvIcon',
  UsersIcon: 'UsersIcon',
  HeartIcon: 'HeartIcon',
  SearchIcon: 'SearchIcon',
  ArrowLeftIcon: 'ArrowLeftIcon',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock expo-local-authentication
jest.mock('expo-local-authentication', () => ({
  authenticateAsync: jest.fn(),
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
}));

// Mock AppState from react-native
jest.mock('react-native/Libraries/AppState/AppState', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
  currentState: 'active',
}));

// Mock Appearance API
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
  addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// Mock fetch for API calls
global.fetch = jest.fn();