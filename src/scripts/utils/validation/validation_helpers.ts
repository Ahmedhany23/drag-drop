import { validation } from "./validation_types";

/**
 * @desc assign pattern validation in inputs
 * @param1 titleValue :string
 * @param2 descValue :string
 * @returns [titleInputRule, descInputRule]: validation[]
 */

export const assignValidateInputs = (titleValue: string, descValue: string) => {
  const titleInputRule: validation = {
    type: "text",
    value: titleValue,
    required: true,
    minLength: 2,
    maxLength: 50,
  };
  const descInputRule: validation = {
    type: "text",
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
  let errorMessage: string = "";
  // required
  if (inputRule.required && inputRule.value.trim().length === 0) {
    errorMessage = `${inputRule.type} is required.`;
  }

  // min length
  if (
    inputRule.minLength &&
    inputRule.value.trim().length < inputRule.minLength
  ) {
    errorMessage = `${inputRule.type} must be at least ${inputRule.minLength} characters long.`;
  }
  // max length
  if (
    inputRule.maxLength &&
    inputRule.value.trim().length > inputRule.maxLength
  ) {
    errorMessage = `${inputRule.type} must be no more than ${inputRule.maxLength} characters long.`;
  }

  return errorMessage;
};
