import React from "react";
import { Box, Text, Link, HStack } from "@chakra-ui/react";

export const Footer: React.FC = () => {
  return (
    <Box
      as="footer"
      py={4}
      px={8}
      bg="white"
      borderTop="1px"
      borderColor="gray.100"
    >
      <HStack justify="space-between">
        <Text fontSize="sm" color="gray.600">
          © {new Date().getFullYear()} SchoolReports. All rights reserved.
        </Text>
        <HStack spacing={4}>
          <Link fontSize="sm" color="gray.600">
            Privacy
          </Link>
          <Link fontSize="sm" color="gray.600">
            Terms
          </Link>
          <Link fontSize="sm" color="gray.600">
            Support
          </Link>
        </HStack>
      </HStack>
    </Box>
  );
};
