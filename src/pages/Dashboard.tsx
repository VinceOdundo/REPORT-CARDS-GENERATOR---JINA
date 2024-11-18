import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Heading,
  SimpleGrid,
  Progress,
  Text,
  Badge,
  Fade,
} from "@chakra-ui/react";
import { RewardsPanel } from "../features/gamification/components/RewardsPanel";
import { PerformanceAnalyticsPanel } from "../features/analytics/components/PerformanceAnalytics";
import { DashboardStats } from "../features/dashboard/DashboardStats";
import { RecentActivity } from "../features/dashboard/RecentActivity";
import { ProgressTracker } from "../features/gamification/ProgressTracker";
import { useAuth } from "../features/auth/useAuth";

interface Progress {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

interface Achievement {
  name: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [recentAchievement, setRecentAchievement] =
    useState<Achievement | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        const tracker = new ProgressTracker();
        const userProgress = await tracker.getProgress(user.id);
        setProgress(userProgress);
      }
    };
    fetchProgress();
  }, [user?.id]);

  return (
    <Box p={8}>
      <Heading mb={6}>School Dashboard</Heading>
      {progress && (
        <Box mb={6}>
          <Text fontSize="lg">Level {progress.level}</Text>
          <Progress
            value={(progress.xp / progress.xpToNextLevel) * 100}
            colorScheme="green"
            size="lg"
            borderRadius="md"
          />
          <Text>
            {progress.xp} / {progress.xpToNextLevel} XP to next level
          </Text>
          {recentAchievement && (
            <Fade in={true}>
              <Badge colorScheme="green" p={2} borderRadius="md">
                🎉 New Achievement: {recentAchievement.name}
              </Badge>
            </Fade>
          )}
        </Box>
      )}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <DashboardStats />
        <PerformanceAnalyticsPanel />
        <RecentActivity />
      </SimpleGrid>

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
