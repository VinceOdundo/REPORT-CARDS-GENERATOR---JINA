import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  useToast,
  HStack,
  Text,
  Progress,
  Center,
} from "@chakra-ui/react";
import { PDFViewer, Document, Page } from "@react-pdf/renderer";
import { useReports } from "./useReports";
import { ReportTemplate } from "./ReportTemplate";
import { useSubscription } from "../../hooks/useSubscription";
import { PermissionChecker } from "../../utils/permissions";
import { RateLimiter } from "../../utils/RateLimiter";
import { CacheManager } from "../../utils/CacheManager";
import { useAuth } from "../../features/auth/useAuth";
import { School, Student } from "../../types/school";
import { AchievementSystem } from "../gamification/AchievementSystem";
import { ProgressTracker } from "../gamification/ProgressTracker";

const STUDENTS_PER_CHUNK = 10;

export const ReportGenerator: React.FC<{
  students: Student[];
  schoolInfo: School;
}> = ({ students, schoolInfo }) => {
  const toast = useToast();
  const { generateReport, loading } = useReports();
  const { subscription } = useSubscription();
  const { user } = useAuth();
  const achievementSystem = new AchievementSystem();
  const progressTracker = new ProgressTracker();

  const [currentPage, setCurrentPage] = useState(0);
  const [processingChunk, setProcessingChunk] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  const totalPages = Math.ceil(students.length / STUDENTS_PER_CHUNK);
  const currentStudents = students.slice(
    currentPage * STUDENTS_PER_CHUNK,
    (currentPage + 1) * STUDENTS_PER_CHUNK
  );

  const handleGenerate = async () => {
    if (students.length > subscription?.reportCardsRemaining!) {
      toast({
        title: "Report limit exceeded",
        description:
          "Please upgrade your subscription to generate more reports",
        status: "error",
      });
      return;
    }

    // Check permissions
    if (!user) {
      toast({
        title: "User not found",
        description: "Please log in to generate reports",
        status: "error",
      });
      return;
    }

    const canGenerate = await PermissionChecker.canGenerateReport(
      user.id,
      schoolInfo.id
    );
    if (!canGenerate) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to generate reports",
        status: "error",
      });
      return;
    }

    // Check rate limit
    const withinLimit = await RateLimiter.checkLimit(
      user.id,
      "report-generation"
    );
    if (!withinLimit) {
      toast({
        title: "Rate limit exceeded",
        description: "Please try again later",
        status: "error",
      });
      return;
    }

    setProcessingChunk(true);
    try {
      const cacheKey = `report-template-${schoolInfo.id}`;
      let template = CacheManager.get(cacheKey);

      if (!template) {
        // Simulate progress
        for (let i = 0; i <= 100; i += 20) {
          // Simulate processing time
          await new Promise((resolve) => setTimeout(resolve, 200));
          setGenerationProgress(i);
        }
        template = await generateReport(currentStudents, schoolInfo);
        CacheManager.set(cacheKey, template);
      }

      // Award XP and check achievements
      const xpGained = currentStudents.length * 10; // 10 XP per report
      const newProgress = await progressTracker.updateProgress(
        user.id,
        xpGained
      );
      await achievementSystem.checkAchievements(
        user.id,
        "generate_report",
        currentStudents.length
      );

      toast({
        title: "Success!",
        description: `Generated ${currentStudents.length} reports (+${xpGained} XP)`,
        status: "success",
      });

      setProcessingChunk(false);
    } catch (error) {
      setProcessingChunk(false);
      toast({
        title: "Error generating reports",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
      });
    }
  };

  return (
    <Box>
      <HStack spacing={4} mb={4}>
        <Button
          isLoading={loading || processingChunk}
          onClick={handleGenerate}
          colorScheme="blue"
        >
          Generate Reports
        </Button>
        <Text>
          Page {currentPage + 1} of {totalPages}
        </Text>
        <Button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          isDisabled={currentPage === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
          isDisabled={currentPage === totalPages - 1}
        >
          Next
        </Button>
      </HStack>

      {processingChunk && (
        <Center mb={4}>
          <Box w="100%">
            <Text mb={2}>Generating reports...</Text>
            <Progress value={generationProgress} size="md" colorScheme="blue" />
          </Box>
        </Center>
      )}

      <PDFViewer>
        <Document>
          {currentStudents.map((student) => (
            <Page key={student.id}>
              <ReportTemplate student={student} school={schoolInfo} />
            </Page>
          ))}
        </Document>
      </PDFViewer>
    </Box>
  );
};
