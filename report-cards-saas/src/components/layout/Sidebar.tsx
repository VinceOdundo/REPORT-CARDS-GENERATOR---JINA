import React from "react";
import { Box, VStack, Link, Icon, Text, Flex } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/", icon: "📊" },
  { label: "Reports", path: "/reports", icon: "📄" },
  { label: "Settings", path: "/settings", icon: "⚙️" },
  { label: "Billing", path: "/billing", icon: "💳" },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

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
      </VStack>
    </Box>
  );
};
