import React from "react";
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { ReportGenerator } from "../features/reports/ReportGenerator";
import { useSubscription } from "../hooks/useSubscription";

const Reports: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { subscription } = useSubscription();

  return (
    <Box p={8}>
      <VStack align="stretch" spacing={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg">Report Cards</Heading>
          <Button
            colorScheme="blue"
            onClick={onOpen}
            isDisabled={!subscription?.reportCardsRemaining}
          >
            Generate New Report
          </Button>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Student Name</Th>
              <Th>Class</Th>
              <Th>Date Generated</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>{/* Report rows will be mapped here */}</Tbody>
        </Table>

        <ReportGenerator isOpen={isOpen} onClose={onClose} />
      </VStack>
    </Box>
  );
};

export default Reports;
