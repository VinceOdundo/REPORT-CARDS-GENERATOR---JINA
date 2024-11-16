import React from "react";
import { Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";
import { reportService } from "../reports/reportService";

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = React.useState([]);
  const bgColor = useColorModeValue("white", "gray.700");

  React.useEffect(() => {
    const loadActivities = async () => {
      const history = await reportService.getReportHistory();
      setActivities(history);
    };
    loadActivities();
  }, []);

  return (
    <Box bg={bgColor} p={5} borderRadius="lg" shadow="sm">
      <Text fontSize="xl" mb={4}>
        Recent Activity
      </Text>
      <VStack spacing={4} align="stretch">
        {activities.map((activity) => (
          <Box key={activity.id} p={3} borderRadius="md" bg={bgColor}>
            {/* Activity details */}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
