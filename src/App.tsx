import React from "react";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./features/auth/AuthProvider";
import { MainLayout } from "./components/layout/MainLayout";
import { theme } from "./styles/themes/main";

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <AuthProvider>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
