import { isValid, parse } from "date-fns";
import * as Yup from "yup";

import { dateToString, isFutureDate } from "@mtfh/common/lib/utils";

export const dateTimeIsValid =
  (
    errorMessages: Record<string, string>,
    yearFieldName: any,
    monthFieldName: string,
    dayFieldName: string,
    hourFieldName: string,
    minuteFieldName: string,
    amPmFieldName: string,
  ) =>
  (
    value: string | undefined,
    context: Yup.TestContext<object>,
  ): boolean | Yup.ValidationError => {
    const dateString = `${context.parent[yearFieldName]}-${
      context.parent[monthFieldName]
    }-${context.parent[dayFieldName]} ${context.parent[hourFieldName]}:${
      context.parent[minuteFieldName]
    } ${context.parent[amPmFieldName]?.toUpperCase()}`;

    if (dateString.includes("undefined")) {
      return false;
    }
    const date = parse(dateString, "yyyy-MM-dd hh:mm a", new Date());

    if (isValid(date)) {
      if (!isFutureDate(dateToString(date, "yyyy-MM-dd'T'HH:mm:ss"))) {
        return context.createError({
          message: errorMessages.W51,
        });
      }
      return true;
    }
    return false;
  };

export const appointmentSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    hour: Yup.string().required(errorMessages.W9),
    minute: Yup.string().required(errorMessages.W9),
    day: Yup.string()
      .matches(/^0[1-9]|^1\d|^2\d|3[0-1]$/, errorMessages.W12)
      .required(errorMessages.W12),
    month: Yup.string()
      .matches(/^0[1-9]|1[0-2]$/, errorMessages.W11)
      .required(errorMessages.W11),
    year: Yup.string()
      .matches(/^\d{4}$/, errorMessages.W13)
      .test(
        "year",
        errorMessages.W9,
        dateTimeIsValid(errorMessages, "year", "month", "day", "hour", "minute", "amPm"),
      )
      .required(errorMessages.W13),
    amPm: Yup.string().oneOf(["am", "pm"]).required(errorMessages.W4).nullable(true),
  }).required();

export type AppointmentFormData = Yup.Asserts<ReturnType<typeof appointmentSchema>>;
