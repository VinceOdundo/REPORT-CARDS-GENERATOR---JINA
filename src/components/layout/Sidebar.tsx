import React from "react";
import { Box, VStack, Link, Text, Flex } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import {
  authenticatedMenuItems,
  publicMenuItems,
} from "../../config/navigation";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const menuItems = isAuthenticated ? authenticatedMenuItems : publicMenuItems;

  return (
    <Box
      as="aside"
      bg="white"
      w={{ base: "full", md: "64" }}
      h="full"
      px={4}
      py={8}
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            as={RouterLink}
            to={item.path}
            p={3}
            borderRadius="md"
            bg={location.pathname === item.path ? "primary.50" : "transparent"}
            color={location.pathname === item.path ? "primary.500" : "gray.600"}
            _hover={{ bg: "primary.50", color: "primary.500" }}
          >
            <Flex align="center" gap={3}>
              <Text>{item.icon}</Text>
              <Text>{item.label}</Text>
            </Flex>
          </Link>
        ))}
        {!isAuthenticated && (
          <VStack
            spacing={2}
            mt={4}
            pt={4}
            borderTop="1px"
            borderColor="gray.200"
          >
            <Link
              as={RouterLink}
              to="/login"
              w="full"
              p={3}
              borderRadius="md"
              bg="blue.500"
              color="white"
              textAlign="center"
              _hover={{ bg: "blue.600" }}
            >
              Login
            </Link>
            <Link
              as={RouterLink}
              to="/signup"
              w="full"
              p={3}
              borderRadius="md"
              bg="gray.100"
              color="gray.800"
              textAlign="center"
              _hover={{ bg: "gray.200" }}
            >
              Sign Up
            </Link>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
