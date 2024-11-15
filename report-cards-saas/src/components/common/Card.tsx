import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

interface CardProps extends BoxProps {
  variant?: "elevated" | "outline" | "filled" | "unstyled";
}

export const Card: React.FC<CardProps> = ({
  variant = "elevated",
  children,
  ...props
}) => {
  return (
    <Box
      as="section"
      variant={variant}
      __css={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        borderRadius: "lg",
        p: 6,
        ...props.__css,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
