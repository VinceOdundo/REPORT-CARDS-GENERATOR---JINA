import React from "react";
import {
  Box,
  SimpleGrid,
  VStack,
  Text,
  Button,
  useToast,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { FaGift, FaCrown, FaChartLine } from "react-icons/fa";
import { rewards } from "../RewardSystem";
import { useAuth } from "../../auth/useAuth";
import { useAnalytics } from "../../analytics/AnalyticsProvider";

export const RewardsPanel: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

  const handleClaimReward = async (rewardId: string) => {
    try {
      const rewardSystem = new RewardSystem();
      const success = await rewardSystem.claimReward(user!.uid, rewardId);

      if (success) {
        await trackEvent("reward_claimed", { rewardId });
        toast({
          title: "Reward Claimed!",
          description: "Your reward has been added to your account.",
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Not enough points",
          description: "Keep earning points to claim this reward!",
          status: "warning",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error claiming reward",
        description:
          error instanceof Error ? error.message : "Please try again later",
        status: "error",
        duration: 3000,
      });
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "REPORT_CARDS":
        return FaGift;
      case "PREMIUM_DAYS":
        return FaCrown;
      case "ANALYTICS_ACCESS":
        return FaChartLine;
      default:
        return FaGift;
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="sm">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {Object.entries(rewards).map(([id, reward]) => (
          <VStack
            key={id}
            p={4}
            bg="gray.50"
            borderRadius="md"
            spacing={3}
            align="stretch"
          >
            <Icon
              as={getRewardIcon(reward.type)}
              boxSize={6}
              color="blue.500"
            />
            <Text fontWeight="bold">{reward.name}</Text>
            <Text fontSize="sm" color="gray.600">
              {reward.description}
            </Text>
            <Badge colorScheme="blue">{reward.cost} points</Badge>
            <Button
              colorScheme="blue"
              onClick={() => handleClaimReward(id)}
              size="sm"
            >
              Claim Reward
            </Button>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};
