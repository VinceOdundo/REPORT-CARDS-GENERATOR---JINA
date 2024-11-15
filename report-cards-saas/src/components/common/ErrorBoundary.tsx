import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <VStack spacing={4} p={8} align="center">
            <Text fontSize="lg">Something went wrong</Text>
            <Button onClick={() => this.setState({ hasError: false })}>
              Try again
            </Button>
          </VStack>
        )
      );
    }

    return this.props.children;
  }
}
