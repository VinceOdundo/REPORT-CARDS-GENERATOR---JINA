import { extendTheme } from '@chakra-ui/react';
import { colors } from './colors';
import { buttonStyles } from '../components/button';
import { cardStyles } from '../components/card';
import { formStyles } from '../components/form';

export const theme = extendTheme({
  colors,
  components: {
    Button: {
      ...buttonStyles,
      baseStyle: {
        _focus: { boxShadow: "none" },
      },
    },
    Card: cardStyles,
    Form: formStyles,
    Input: {
      variants: {
        filled: {
          field: {
            bg: "gray.100",
            _hover: {
              bg: "gray.200",
            },
            _focus: {
              bg: "white",
              borderColor: "blue.500",
            },
          },
        },
      },
      defaultProps: {
        variant: "filled",
      },
    },
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