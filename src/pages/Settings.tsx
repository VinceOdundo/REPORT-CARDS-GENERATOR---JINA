import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip,
  Icon,
  Text,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

const Settings: React.FC = () => {
  return (
    <Box p={8}>
      <Heading mb={6}>Settings</Heading>
      <Tabs variant="enclosed-colored">
        <TabList>
          <Tab>School Profile</Tab>
          <Tab>Report Templates</Tab>
          <Tab>Users</Tab>
          <Tab>Preferences</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Text fontSize="sm" color="gray.600" mb={4}>
                Complete your school profile to unlock additional features and
                personalize your reports.
              </Text>
              <FormControl isRequired>
                <FormLabel>
                  School Name
                  <Tooltip label="This will appear on all your reports">
                    <Icon as={InfoIcon} ml={1} />
                  </Tooltip>
                </FormLabel>
                <Input placeholder="Enter school name" />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input />
              </FormControl>
              <Button
                colorScheme="blue"
                size="lg"
                rightIcon={<Icon as={InfoIcon} />}
              >
                Save Profile
              </Button>
            </VStack>
          </TabPanel>
          {/* Other tab panels */}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Settings;
