import { isValid, parse } from "date-fns";
import * as Yup from "yup";

import { dateToString, isFutureDate } from "@mtfh/common/lib/utils";

export const dateTimeIsValid = (
  errorMessages: Record<string, string>,
  values,
): boolean | string => {
  const dateString = `${values.year}-${values.month}-${values.day} ${values.hour}:${
    values.minute
  } ${values.amPm?.toUpperCase()}`;

  if (dateString.includes("undefined")) {
    return false;
  }
  const date = parse(dateString, "yyyy-MM-dd hh:mm a", new Date());

  if (isValid(date)) {
    if (!isFutureDate(dateToString(date, "yyyy-MM-dd'T'HH:mm:ss"))) {
      return errorMessages.W52;
    }
    return true;
  }
  return false;
};

export const appointmentSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    hour: Yup.string()
      .matches(/^0[1-9]|1[0-2]$/, errorMessages.W54)
      .required(errorMessages.W54),
    minute: Yup.string()
      .matches(/^[0-5]\d$/, errorMessages.W55)
      .required(errorMessages.W55),
    day: Yup.string()
      .matches(/^0[1-9]|^1\d|^2\d|3[0-1]$/, errorMessages.W12)
      .required(errorMessages.W12),
    month: Yup.string()
      .matches(/^0[1-9]|1[0-2]$/, errorMessages.W11)
      .required(errorMessages.W11),
    year: Yup.string()
      .matches(/^\d{4}$/, errorMessages.W13)
      .required(errorMessages.W13),
    amPm: Yup.string().oneOf(["am", "pm"]).required(errorMessages.W4).nullable(true),
  }).required();

export type AppointmentFormData = Yup.Asserts<ReturnType<typeof appointmentSchema>>;
