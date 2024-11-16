import React from "react";
import {
  Box,
  Flex,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Link,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Box as="header" bg="white" px={8} py={4} boxShadow="sm">
      <Flex
        justify="space-between"
        align="center"
        maxW="container.xl"
        mx="auto"
      >
        <RouterLink to="/">
          <Image src="/assets/images/favicon.png" alt="Logo" h="40px" />
        </RouterLink>

        {isAuthenticated ? (
          <HStack spacing={4}>
            <Menu>
              <MenuButton>
                <Avatar
                  size="sm"
                  name={user?.displayName}
                  src={user?.photoURL}
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/settings">
                  Profile
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        ) : (
          <HStack spacing={8}>
            <HStack spacing={8} display={{ base: "none", md: "flex" }}>
              <Link as={RouterLink} to="/#features" fontWeight="medium">
                Features
              </Link>
              <Link as={RouterLink} to="/#pricing" fontWeight="medium">
                Pricing
              </Link>
              <Link as={RouterLink} to="/contact" fontWeight="medium">
                Contact
              </Link>
            </HStack>
            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                colorScheme="blue"
              >
                Sign In
              </Button>
              <Button as={RouterLink} to="/signup" colorScheme="blue">
                Get Started
              </Button>
            </HStack>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};
