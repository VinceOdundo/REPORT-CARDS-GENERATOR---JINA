import { defineStyleConfig } from '@chakra-ui/react';

export const cardStyles = defineStyleConfig({
  baseStyle: {
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    alignItems: 'start',
    gap: 2,
    borderRadius: 'lg',
    boxShadow: 'sm',
    p: 6,
  },
  variants: {
    elevated: {
      boxShadow: 'md',
      _hover: {
        boxShadow: 'lg',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out'
      }
    },
    outline: {
      border: '1px solid',
      borderColor: 'gray.200',
    },
    filled: {
      bg: 'gray.50',
    },
    unstyled: {
      bg: 'none',
      boxShadow: 'none',
      p: 0,
    }
  },
  sizes: {
    sm: {
      p: 4,
      fontSize: 'sm',
    },
    md: {
      p: 6,
      fontSize: 'md',
    },
    lg: {
      p: 8,
      fontSize: 'lg',
    }
  },
  defaultProps: {
    variant: 'elevated',
    size: 'md',
  }
});