import React, { useState } from "react";
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
  FormErrorMessage,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

const SignUp: React.FC = () => {
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!schoolName) newErrors.schoolName = "School name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await signup(email, password, { schoolName });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to sign up",
        status: "error",
        duration: 5000,
        isClosable: true,
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
        <Image
          src="/assets/images/favicon.png"
          alt="Logo"
          w="150px"
          _hover={{ transform: "scale(1.05)" }}
          transition="transform 0.2s"
        />

        <Box as="form" onSubmit={handleSubmit} width="100%">
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.schoolName}>
              <FormLabel>School Name</FormLabel>
              <Input
                placeholder="Enter your school name"
                value={schoolName}
                onChange={(e) => {
                  setSchoolName(e.target.value);
                  setErrors((prev) => ({ ...prev, schoolName: "" }));
                }}
                _hover={{ borderColor: "blue.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              />
              {errors.schoolName && (
                <FormErrorMessage>{errors.schoolName}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                _hover={{ borderColor: "blue.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              />
              {errors.email && (
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                _hover={{ borderColor: "blue.300" }}
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              />
              {errors.password && (
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              )}
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              w="100%"
              size="lg"
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
            >
              Sign Up
            </Button>
          </VStack>
        </Box>

        <Text fontSize="sm" color="gray.600">
          Already have an account?{" "}
          <ChakraLink
            as={RouterLink}
            to="/login"
            color="blue.500"
            _hover={{
              color: "blue.600",
              textDecoration: "underline",
            }}
          >
            Sign in
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default SignUp;
