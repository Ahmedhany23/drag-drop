import { validation } from "./validation_types";

/**
 * @desc assign pattern validation in inputs
 * @param1 titleValue :string
 * @param2 descValue :string
 * @returns [titleInputRule, descInputRule]: validation[]
 */

export const assignListValidateInputs = (titleValue: string) => {
  const titleInputRule: validation = {
    type: "Title",
    value: titleValue,
    required: true,
    minLength: 2,
    maxLength: 50,
  };
  return [titleInputRule];
};

export const assignProjectValidateInputs = (
  titleValue: string,
  descValue: string,
  
) => {
  const titleInputRule: validation = {
    type: "Title",
    value: titleValue,
    required: true,
    minLength: 2,
    maxLength: 50,
  };
  const descInputRule: validation = {
    type: "Description",
    value: descValue,
    required: true,
    minLength: 2,
    maxLength: 200,
  };
  return [titleInputRule, descInputRule];
};

/**
 * @desc handle validation errors
 * @param inputRule : input pattern validation
 * @returns  error message
 *  */

export const handleValidationErrors = (inputRule: validation): string => {
  const trimmedValue = inputRule.value.trim();

  // Validations
  if (inputRule.required && trimmedValue.length === 0) {
    return `${inputRule.type} is required.`;
  }
  if (inputRule.minLength && trimmedValue.length < inputRule.minLength) {
    return `${inputRule.type} must be at least ${inputRule.minLength} characters.`;
  }
  if (inputRule.maxLength && trimmedValue.length > inputRule.maxLength) {
    return `${inputRule.type} must be no more than ${inputRule.maxLength} characters.`;
  }

  return "";
};
