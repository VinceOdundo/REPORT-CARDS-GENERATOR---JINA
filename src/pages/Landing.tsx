import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Link as ChakraLink,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { APP_CONSTANTS } from "../utils/constants";
import { CheckCircleIcon } from "@chakra-ui/icons";

const Feature = ({ title, text, icon }: any) => {
  return (
    <Stack spacing={4} align="center" textAlign="center">
      <Box fontSize="48px">{icon}</Box>
      <Text fontWeight={600}>{title}</Text>
      <Text color="gray.600">{text}</Text>
    </Stack>
  );
};

const PriceCard = ({
  tier,
}: {
  tier: keyof typeof APP_CONSTANTS.SUBSCRIPTION_TIERS;
}) => {
  const features =
    APP_CONSTANTS.FEATURES[
      tier.toUpperCase() as keyof typeof APP_CONSTANTS.FEATURES
    ];
  const price =
    APP_CONSTANTS.PRICING[
      tier.toUpperCase() as keyof typeof APP_CONSTANTS.PRICING
    ];

  return (
    <Box
      p={6}
      bg="white"
      rounded="xl"
      shadow="base"
      textAlign="center"
      position="relative"
      borderWidth={tier === "PREMIUM" ? "2px" : "1px"}
      borderColor={tier === "PREMIUM" ? "blue.400" : "gray.200"}
    >
      {tier === "PREMIUM" && (
        <Text
          position="absolute"
          top="-3"
          right="-1"
          bg="blue.400"
          color="white"
          px={3}
          py={1}
          fontSize="sm"
          fontWeight="bold"
          rounded="full"
        >
          POPULAR
        </Text>
      )}
      <Text
        textTransform="uppercase"
        fontWeight="bold"
        color="blue.500"
        letterSpacing="wide"
      >
        {tier.toLowerCase()}
      </Text>
      <Text fontSize="4xl" fontWeight="bold" my={4}>
        {price === 0 ? "Free" : `${price} KES`}
      </Text>
      <List spacing={3} textAlign="left" mb={6}>
        {features.map((feature, index) => (
          <ListItem key={index}>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            {feature}
          </ListItem>
        ))}
      </List>
      <Button
        as={RouterLink}
        to="/signup"
        w="full"
        colorScheme={tier === "PREMIUM" ? "blue" : "gray"}
        variant={tier === "PREMIUM" ? "solid" : "outline"}
      >
        Get Started
      </Button>
    </Box>
  );
};

const Landing: React.FC = () => {
  const testimonials = [
    {
      quote:
        "SchoolReports has transformed how we generate report cards. What used to take days now takes minutes.",
      author: "Sarah Kimani",
      title: "Principal, Nairobi Academy",
    },
    {
      quote:
        "The best investment we've made for our administrative processes. The support team is also very responsive.",
      author: "James Omondi",
      title: "Head Teacher, Mombasa High School",
    },
    {
      quote:
        "Easy to use and very reliable. Our parents love the professional look of our new report cards.",
      author: "Mary Wanjiku",
      title: "Deputy Principal, Kisumu Primary",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box bg="blue.50" py={20}>
        <Container maxW="container.xl">
          <Stack spacing={8} align="center" textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
            >
              Modern Report Card Generator
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              Generate professional school report cards in minutes. Save time
              and streamline your academic reporting process.
            </Text>
            <Stack direction="row" spacing={4}>
              <Button
                as={RouterLink}
                to="/signup"
                colorScheme="blue"
                size="lg"
                rounded="full"
                px={8}
              >
                Get Started Free
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                variant="outline"
                size="lg"
                rounded="full"
                px={8}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <Stack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading>Features that Make Us Stand Out</Heading>
            <Text color="gray.600" maxW="2xl">
              Everything you need to generate professional report cards
              efficiently
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon="🚀"
              title="Quick Generation"
              text="Generate multiple report cards in seconds with our batch processing system"
            />
            <Feature
              icon="📱"
              title="Mobile Friendly"
              text="Access and generate reports from any device, anywhere"
            />
            <Feature
              icon="🔒"
              title="Secure & Private"
              text="Your data is encrypted and stored securely in the cloud"
            />
            <Feature
              icon="📊"
              title="Rich Analytics"
              text="Get insights into student performance with detailed analytics"
            />
            <Feature
              icon="🎨"
              title="Customizable Templates"
              text="Create and customize report card templates to match your school's brand"
            />
            <Feature
              icon="💾"
              title="Auto-Save"
              text="Never lose your work with automatic saving and version history"
            />
          </SimpleGrid>
        </Stack>
      </Container>

      {/* Testimonials Section */}
      <Box bg="blue.50" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading textAlign="center">
              Trusted by Schools Across Kenya
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {testimonials.map((testimonial, index) => (
                <Box
                  key={index}
                  bg="white"
                  p={8}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Text fontSize="lg" fontStyle="italic" mb={4}>
                    "{testimonial.quote}"
                  </Text>
                  <Text fontWeight="bold">{testimonial.author}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {testimonial.title}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box bg="gray.50" py={20}>
        <Container maxW="container.xl">
          <Stack spacing={12}>
            <Stack spacing={4} align="center" textAlign="center">
              <Heading>Simple, Transparent Pricing</Heading>
              <Text color="gray.600" maxW="2xl">
                Choose the plan that best fits your needs. All plans include
                core features.
              </Text>
            </Stack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              {Object.keys(APP_CONSTANTS.SUBSCRIPTION_TIERS).map((tier) => (
                <PriceCard
                  key={tier}
                  tier={tier as keyof typeof APP_CONSTANTS.SUBSCRIPTION_TIERS}
                />
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
