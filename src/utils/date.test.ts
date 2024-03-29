import { dateToString, reformatDate, stringToDate } from "./date";

test("dateToString will convert date to string correctly", () => {
  let date = stringToDate("2023-10-03 10:38 AM", "yyyy-MM-dd hh:mm a");
  expect(dateToString(date, "yyyy-MM-dd'T'HH:mm:ss")).toBe("2023-10-03T10:38:00");

  date = stringToDate("2023-10-03 10:38 PM", "yyyy-MM-dd hh:mm a");
  expect(dateToString(date, "yyyy-MM-dd'T'HH:mm:ss")).toBe("2023-10-03T22:38:00");

  date = stringToDate("2023-06-02 09:00 PM", "yyyy-MM-dd hh:mm a");
  expect(dateToString(date, "yyyy-MM-dd'T'HH:mm:ss")).toBe("2023-06-02T21:00:00");
});

test("reformatDate will convert a date string to another format correctly", () => {
  let reformattedStr = reformatDate(
    "2023-10-03 10:38 AM",
    "yyyy-MM-dd hh:mm a",
    "yyyy-MM-dd'T'HH:mm:ss",
  );
  expect(reformattedStr).toBe("2023-10-03T10:38:00");

  reformattedStr = reformatDate(
    "2023-10-03 10:38 PM",
    "yyyy-MM-dd hh:mm a",
    "yyyy-MM-dd'T'HH:mm:ss",
  );
  expect(reformattedStr).toBe("2023-10-03T22:38:00");

  reformattedStr = reformatDate(
    "2023-06-02 09:00 PM",
    "yyyy-MM-dd hh:mm a",
    "yyyy-MM-dd'T'HH:mm:ss",
  );
  expect(reformattedStr).toBe("2023-06-02T21:00:00");
});
