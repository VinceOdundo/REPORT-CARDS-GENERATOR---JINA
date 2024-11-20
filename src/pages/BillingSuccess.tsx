import React, { useEffect } from "react";
import { Box, Heading, Text, Spinner, Center } from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { paymentService } from "../features/payments/paymentService";
import { useToast } from "@chakra-ui/react";

export const BillingSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const checkoutId = searchParams.get("checkout");
    if (checkoutId) {
      verifyPayment(checkoutId);
    }
  }, [searchParams]);

  const verifyPayment = async (checkoutId: string) => {
    try {
      await paymentService.verifyPayment(checkoutId);
      toast({
        title: "Payment successful",
        description: "Your subscription has been activated",
        status: "success",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Verification failed",
        description:
          "Please contact support if your subscription is not activated",
        status: "error",
      });
      navigate("/billing");
    }
  };

  return (
    <Center h="100vh">
      <Box textAlign="center">
        <Heading mb={4}>Processing your payment...</Heading>
        <Spinner size="xl" />
        <Text mt={4}>Please wait while we verify your payment</Text>
      </Box>
    </Center>
  );
};
