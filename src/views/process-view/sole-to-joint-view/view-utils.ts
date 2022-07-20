import { processes } from "../../../services";

const { states } = processes.soletojoint;

const {
  documentsRequestedDes,
  documentsRequestedAppointment,
  documentsAppointmentRescheduled,
} = states;

export const reviewDocumentsStates = [
  documentsRequestedDes.state,
  documentsRequestedAppointment.state,
  documentsAppointmentRescheduled.state,
];
