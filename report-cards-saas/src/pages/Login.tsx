import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useAuth } from "../features/auth/useAuth";

const Login: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <VStack
        spacing={8}
        w={{ base: "90%", md: "400px" }}
        p={8}
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Image src="/logo.png" alt="Logo" w="150px" />
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" w="100%">
              Login
            </Button>
          </VStack>
        </form>
        <Text fontSize="sm">
          Don't have an account? <Button variant="link">Sign up</Button>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;
