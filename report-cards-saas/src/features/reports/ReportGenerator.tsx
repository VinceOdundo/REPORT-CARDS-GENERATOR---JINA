import React, { useState, useCallback } from "react";
import { Box, Button, useToast, HStack, Text } from "@chakra-ui/react";
import { PDFViewer, Document, Page } from "@react-pdf/renderer";
import { useReports } from "./useReports";
import { ReportTemplate } from "./ReportTemplate";
import { useSubscription } from "../../hooks/useSubscription";
import { PermissionChecker } from "../../utils/permissions";
import { RateLimiter } from "../../config/rateLimit";
import { CacheManager } from "../../utils/caching";

const STUDENTS_PER_CHUNK = 10;

export const ReportGenerator: React.FC<{
  students: Student[];
  schoolInfo: SchoolInfo;
}> = ({ students, schoolInfo }) => {
  const toast = useToast();
  const { generateReport, loading } = useReports();
  const { subscription } = useSubscription();

  const [currentPage, setCurrentPage] = useState(0);
  const [processingChunk, setProcessingChunk] = useState(false);

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
        template = await generateReport(currentStudents, schoolInfo);
        CacheManager.set(cacheKey, template);
      }

      setProcessingChunk(false);
    } catch (error) {
      toast({
        title: "Error generating reports",
        description: error.message,
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
