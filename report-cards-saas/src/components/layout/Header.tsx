import React from "react";
import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import { useAuth } from "../../features/auth/useAuth";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box as="header" bg="white" px={4} py={2} boxShadow="sm">
      <Flex justify="space-between" align="center">
        <IconButton
          aria-label="Menu"
          icon={<span>≡</span>}
          onClick={onToggle}
          display={{ base: "block", md: "none" }}
        />

        <HStack spacing={4} ml="auto">
          <Menu>
            <MenuButton>
              <Avatar size="sm" name={user?.displayName} src={user?.photoURL} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => logout()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};
