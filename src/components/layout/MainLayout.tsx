import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { useAuth } from "../../features/auth/useAuth";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Flex minH="100vh" direction="column">
      <Header />
      <Flex flex={1}>
        {isAuthenticated && (
          <Box
            display={{ base: "none", md: "block" }}
            w="64"
            position="fixed"
            h="calc(100vh - 4rem)"
          >
            <Sidebar />
          </Box>
        )}
        <Box
          flex={1}
          ml={{ base: 0, md: isAuthenticated ? "64" : 0 }}
          p={8}
          bg="gray.50"
          minH="calc(100vh - 4rem)"
        >
          {children}
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
};
