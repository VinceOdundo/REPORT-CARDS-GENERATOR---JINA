import React from "react";
import {
  Box,
  Grid,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useSubscription } from "../hooks/useSubscription";
import { DashboardStats } from "../features/dashboard/DashboardStats";
import { RecentActivity } from "../features/dashboard/RecentActivity";

const Dashboard: React.FC = () => {
  const { subscription } = useSubscription();

  return (
    <Box p={8}>
      <Heading mb={6}>School Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Reports Generated</StatLabel>
          <StatNumber>{subscription?.reportCardsUsed || 0}</StatNumber>
        </Stat>
        <Stat bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Reports Remaining</StatLabel>
          <StatNumber>
            {(subscription?.reportCardsLimit || 0) -
              (subscription?.reportCardsUsed || 0)}
          </StatNumber>
        </Stat>
        <Stat bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Subscription Status</StatLabel>
          <StatNumber>{subscription?.status || "Free"}</StatNumber>
        </Stat>
      </SimpleGrid>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
        <DashboardStats />
        <RecentActivity />
      </Grid>
    </Box>
  );
};

export default Dashboard;
