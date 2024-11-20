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
  FormErrorMessage,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useAuth } from "../features/auth/useAuth";
import { useAnalytics } from "../features/analytics/AnalyticsProvider";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { theme } from "../styles/themes/main";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login, signInWithGoogle } = useAuth();
  const analytics = useAnalytics();
  const toast = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(email, password);
      await analytics.trackEvent("user_login");
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "Login failed",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      await analytics.trackEvent("google_login");
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Google Sign-in Error",
        description: error instanceof Error ? error.message : "Sign-in failed",
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
      <VStack __css={theme.components.Form.baseStyle.container}>
        <Image src="/assets/images/favicon.png" alt="Logo" w="150px" />
        <Box
          as="form"
          onSubmit={handleSubmit}
          __css={theme.components.Form.baseStyle.form}
        >
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => {
                    const { email, ...rest } = prev;
                    return rest;
                  });
                }}
              />
              {errors.email && (
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => {
                    const { password, ...rest } = prev;
                    return rest;
                  });
                }}
              />
              {errors.password && (
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              )}
            </FormControl>
            <Button type="submit" colorScheme="blue" w="100%">
              Login
            </Button>
            <Button
              leftIcon={<FcGoogle />}
              onClick={handleGoogleSignIn}
              w="100%"
              variant="outline"
            >
              Continue with Google
            </Button>
          </VStack>
        </Box>
        <Text fontSize="sm">
          Don't have an account?{" "}
          <ChakraLink as={RouterLink} to="/signup" color="blue.500">
            Sign up
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;
