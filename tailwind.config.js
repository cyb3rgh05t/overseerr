/* eslint-disable */
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: 'transparent',
      white: '#fff',
      gray: 'transparent',
	  purple: colors.violet,
	  green: colors.emerald,
	  pink: colors.pink,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  variants: {
    cursor: ['disabled'],
    padding: ['first', 'last', 'responsive'],
    borderWidth: ['first', 'last'],
    margin: ['first', 'last', 'responsive'],
    boxShadow: ['group-focus', 'responsive'],
    opacity: ['disabled', 'hover', 'group-hover'],
    ringColor: ['focus', 'focus-within', 'hover', 'active'],
    scale: ['hover', 'focus', 'group-hover'],
    zIndex: ['hover', 'responsive'],
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
