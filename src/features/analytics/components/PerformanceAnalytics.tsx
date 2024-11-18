import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Text,
  useToast,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { PerformanceAnalytics } from "../PerformanceAnalytics";
import { useSchool } from "../../school/SchoolProvider";
import { AppError } from "../../../utils/errorHandling";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const PerformanceAnalyticsPanel: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"term" | "year">("term");
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { school } = useSchool();
  const toast = useToast();
  const analytics = new PerformanceAnalytics();

  const fetchAnalytics = async (retries = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analytics.generateSchoolAnalytics(
        school!.id,
        timeframe
      );
      setMetrics(data);
    } catch (err) {
      if (err instanceof AppError && retries < MAX_RETRIES) {
        setTimeout(() => fetchAnalytics(retries + 1), RETRY_DELAY);
        return;
      }
      setError(err as Error);
      toast({
        title: "Error loading analytics",
        description: "Please try again later",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (school?.id) {
      fetchAnalytics();
    }
  }, [school?.id, timeframe]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load analytics: {error.message}
      </Alert>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="sm">
      <HStack justify="space-between" mb={6}>
        <Heading size="md">Performance Analytics</Heading>
        <FormControl>
          <FormLabel>Time Period</FormLabel>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as "term" | "year")}
            w="200px"
            aria-label="Select time period"
          >
            <option value="term">This Term</option>
            <option value="year">This Year</option>
          </Select>
        </FormControl>
      </HStack>

      {metrics && (
        <VStack spacing={6} align="stretch">
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontWeight="bold">Average Score</Text>
            <Text fontSize="2xl">{metrics.averageScore.toFixed(1)}%</Text>
          </Box>

          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontWeight="bold">Top Performing Subjects</Text>
            {Object.entries(metrics.subjectPerformance)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 3)
              .map(([subject, score]) => (
                <Text key={subject}>
                  {subject}: {(score as number).toFixed(1)}%
                </Text>
              ))}
          </Box>

          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontWeight="bold">Areas for Improvement</Text>
            <Text>{metrics.improvementAreas.join(", ")}</Text>
          </Box>
        </VStack>
      )}
    </Box>
  );
};
