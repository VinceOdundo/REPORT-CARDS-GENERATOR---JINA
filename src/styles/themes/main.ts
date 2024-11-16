import { extendTheme } from '@chakra-ui/react';
import { colors } from './colors';
import { buttonStyles } from '../components/button';
import { cardStyles } from '../components/card';

export const theme = extendTheme({
  colors,
  components: {
    Button: buttonStyles,
    Card: cardStyles,
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});