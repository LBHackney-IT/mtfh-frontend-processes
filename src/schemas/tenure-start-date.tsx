import { isValid, parse } from "date-fns";
import * as Yup from "yup";

export const tenureStartDateIsValid = (
  errorMessages: Record<string, string>,
  values,
): boolean | string => {
  const dateString = `${values.year}-${values.month}-${values.day}`;

  if (dateString.includes("undefined") || values.year < 1000) {
    return false;
  }
  const date = parse(dateString, "yyyy-MM-dd", new Date());

  if (isValid(date)) {
    return true;
  }
  return errorMessages.W9;
};

export const tenureStartDateSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    day: Yup.string()
      .matches(/^0[1-9]|^1\d|^2\d|3[0-1]$/, errorMessages.W12)
      .required(errorMessages.W12),
    month: Yup.string()
      .matches(/^0[1-9]|1[0-2]$/, errorMessages.W11)
      .required(errorMessages.W11),
    year: Yup.string()
      .matches(/^[1-9]\d{3}$/, errorMessages.W13)
      .required(errorMessages.W13),
  }).required();

export type TenureStartDateFormData = Yup.Asserts<
  ReturnType<typeof tenureStartDateSchema>
>;
