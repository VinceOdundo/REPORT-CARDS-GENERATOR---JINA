import React from "react";
import { Box, Grid, Heading, SimpleGrid } from "@chakra-ui/react";
import { RewardsPanel } from "../features/gamification/components/RewardsPanel";
import { PerformanceAnalyticsPanel } from "../features/analytics/components/PerformanceAnalytics";
import { DashboardStats } from "../features/dashboard/DashboardStats";
import { RecentActivity } from "../features/dashboard/RecentActivity";

const Dashboard: React.FC = () => {
  return (
    <Box p={8}>
      <Heading mb={6}>School Dashboard</Heading>
      <DashboardStats />

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8} mt={8}>
        <PerformanceAnalyticsPanel />
        <RecentActivity />
      </Grid>

      <Box mt={8}>
        <Heading size="md" mb={4}>
          Available Rewards
        </Heading>
        <RewardsPanel />
      </Box>
    </Box>
  );
};

export default Dashboard;
