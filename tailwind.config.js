import { colors } from './src/styles/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'sans-regular': ['HostGrotesk_400Regular'],
        'sans-medium': ['HostGrotesk_500Medium'],
        'sans-semibold': ['HostGrotesk_600SemiBold'],
        'sans-bold': ['HostGrotesk_700Bold'],
      },
      colors,
    },
  },
};
