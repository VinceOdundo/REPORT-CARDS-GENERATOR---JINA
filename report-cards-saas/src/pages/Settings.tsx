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
} from "@chakra-ui/react";

const Settings: React.FC = () => {
  return (
    <Box p={8}>
      <Heading mb={6}>Settings</Heading>
      <Tabs>
        <TabList>
          <Tab>School Profile</Tab>
          <Tab>Report Templates</Tab>
          <Tab>Users</Tab>
          <Tab>Preferences</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>School Name</FormLabel>
                <Input />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input />
              </FormControl>
              <Button colorScheme="blue">Save Changes</Button>
            </VStack>
          </TabPanel>
          {/* Other tab panels */}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Settings;
