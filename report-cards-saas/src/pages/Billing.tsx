import React from "react";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useSubscription } from "../hooks/useSubscription";
import { APP_CONSTANTS } from "../utils/constants";

const Billing: React.FC = () => {
  const { subscription } = useSubscription();
  const toast = useToast();

  return (
    <Box p={8}>
      <Heading mb={6}>Subscription Plans</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {Object.values(APP_CONSTANTS.SUBSCRIPTION_TIERS).map((tier) => (
          <VStack
            key={tier}
            p={6}
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            spacing={4}
          >
            <Heading size="md" textTransform="capitalize">
              {tier}
            </Heading>
            <Text fontSize="2xl" fontWeight="bold">
              {tier === "free"
                ? "Free"
                : `${tier === "basic" ? "999 KES" : "2499 KES"}`}
            </Text>
            <Button
              colorScheme="blue"
              isDisabled={subscription?.plan === tier}
              w="full"
            >
              {subscription?.plan === tier ? "Current Plan" : "Select Plan"}
            </Button>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Billing;
