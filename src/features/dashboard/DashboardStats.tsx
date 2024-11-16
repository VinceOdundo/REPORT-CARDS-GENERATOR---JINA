import React from "react";
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { useReports } from "../reports/useReports";
import { useSubscription } from "../../hooks/useSubscription";

export const DashboardStats: React.FC = () => {
  const { subscription } = useSubscription();

  return (
    <SimpleGrid columns={[1, 2, 4]} spacing={5}>
      <Stat>
        <StatLabel>Reports Remaining</StatLabel>
        <StatNumber>{subscription?.reportCardsRemaining}</StatNumber>
        <StatHelpText>From your {subscription?.plan} plan</StatHelpText>
      </Stat>
      {/* Add more stats */}
    </SimpleGrid>
  );
};
