import { defineStyleConfig } from '@chakra-ui/react';

export const buttonStyles = defineStyleConfig({
  baseStyle: {
    fontWeight: 'semibold',
    borderRadius: 'md',
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4,
      py: 2,
    },
    md: {
      fontSize: 'md',
      px: 6,
      py: 3,
    },
    lg: {
      fontSize: 'lg',
      px: 8,
      py: 4,
    },
  },
  variants: {
    solid: {
      bg: 'primary.500',
      color: 'white',
      _hover: {
        bg: 'primary.600',
      },
      _active: {
        bg: 'primary.700',
      },
    },
    outline: {
      border: '2px solid',
      borderColor: 'primary.500',
      color: 'primary.500',
      _hover: {
        bg: 'primary.50',
      },
    },
    ghost: {
      color: 'primary.500',
      _hover: {
        bg: 'primary.50',
      },
    },
    link: {
      color: 'primary.500',
      _hover: {
        textDecoration: 'underline',
      }
    },
    secondary: {
      bg: 'secondary.500',
      color: 'white',
      _hover: {
        bg: 'secondary.600',
      },
      _active: {
        bg: 'secondary.700',
      }
    },
    danger: {
      bg: 'red.500',
      color: 'white',
      _hover: {
        bg: 'red.600',
      },
      _active: {
        bg: 'red.700',
      }
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'solid'
  }
});
