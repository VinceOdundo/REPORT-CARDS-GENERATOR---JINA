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
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [schoolName, setSchoolName] = React.useState("");
  const { signup } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password, { schoolName });
      toast({
        title: "Account created successfully",
        status: "success",
        duration: 3000,
      });
      navigate("/dashboard");
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
        <Image src="/assets/images/favicon.png" alt="Logo" w="150px" />
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>School Name</FormLabel>
              <Input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" w="100%">
              Sign Up
            </Button>
          </VStack>
        </form>
        <Text fontSize="sm">
          Already have an account?{" "}
          <ChakraLink as={RouterLink} to="/login" color="blue.500">
            Sign in
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default SignUp;
