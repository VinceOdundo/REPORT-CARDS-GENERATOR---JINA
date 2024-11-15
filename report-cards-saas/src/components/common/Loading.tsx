import React from "react";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return (
    <Center h="100vh">
      <VStack spacing={4}>
        <Spinner size="xl" color="primary.500" />
        <Text>{message}</Text>
      </VStack>
    </Center>
  );
};
