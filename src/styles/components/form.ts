import { defineStyleConfig } from '@chakra-ui/react';

export const formStyles = defineStyleConfig({
  baseStyle: {
    form: {
      width: '100%'
    },
    container: {
      spacing: 8,
      width: { base: '90%', md: '400px' },
      p: 8,
      bg: 'white',
      borderRadius: 'lg',
      boxShadow: 'lg'
    }
  }
});