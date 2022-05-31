import { format, parse } from "date-fns";

const voidDate = new Date("1900-01-01T00:00:00");

export const stringToDate = (dateStr: string, formatStr: string): Date => {
  return parse(dateStr, formatStr, voidDate);
};

export const dateToString = (date: Date, formatStr: string): string => {
  return format(date, formatStr);
};
