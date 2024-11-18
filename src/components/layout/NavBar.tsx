import React from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  Stack,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

export const NavBar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();

  return (
    <Box bg="blue.500" px={4} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          color="white"
          bg="transparent"
          _hover={{ bg: "blue.600" }}
        />
        <HStack spacing={8} alignItems="center">
          <Box fontWeight="bold">SchoolReports</Box>
          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            <Link as={RouterLink} to="/dashboard">
              Dashboard
            </Link>
            <Link as={RouterLink} to="/reports">
              Reports
            </Link>
            <Link as={RouterLink} to="/settings">
              Settings
            </Link>
          </HStack>
        </HStack>
        <Flex alignItems="center">
          {user ? (
            <Button variant="link" onClick={() => logout()} color="white">
              Logout
            </Button>
          ) : (
            <Button as={RouterLink} to="/login" variant="outline" color="white">
              Login
            </Button>
          )}
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4}>
            <Link as={RouterLink} to="/dashboard">
              Dashboard
            </Link>
            <Link as={RouterLink} to="/reports">
              Reports
            </Link>
            <Link as={RouterLink} to="/settings">
              Settings
            </Link>
            {user && (
              <Button variant="link" onClick={() => logout()} color="white">
                Logout
              </Button>
            )}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};
