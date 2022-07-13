import { parse } from "date-fns";

export const isCurrentState = (state, process) => state === process.currentState.state;
export const isPreviousState = (state, process) =>
  process.previousStates.find((previousState) => state === previousState.state);

export const isSameState = (firstState, secondState) => {
  return firstState.state === secondState.state;
};

export const getPreviousState = (process) => {
  const { previousStates } = process;
  return previousStates[previousStates.length - 1];
};

export const getAppointmentDateTime = ({
  day,
  month,
  year,
  hour,
  minute,
  amPm,
}: {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  amPm: string;
}) => {
  return parse(
    `${year}-${month}-${day} ${hour}:${minute} ${amPm.toUpperCase()}`,
    "yyyy-MM-dd hh:mm a",
    new Date(),
  );
};
