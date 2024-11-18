import { defineStyleConfig } from '@chakra-ui/react';

export const formStyles = defineStyleConfig({
  baseStyle: {
    form: {
      width: '100%',
    },
    container: {
      spacing: 8,
      width: '90%',
      padding: 8,
      background: 'white',
      borderRadius: 'lg',
      boxShadow: 'lg',
    },
  },
});