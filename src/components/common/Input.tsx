import React from "react";
import {
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  InputProps as ChakraInputProps,
} from "@chakra-ui/react";

interface InputProps extends ChakraInputProps {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  leftElement,
  rightElement,
  ...props
}) => {
  return (
    <InputGroup>
      {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
      <ChakraInput {...props} />
      {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
    </InputGroup>
  );
};
