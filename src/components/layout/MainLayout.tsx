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
  return (
    <Box mt={16} px={{ base: 4, md: 8 }} py={4}>
      {children}
    </Box>
  );
};
