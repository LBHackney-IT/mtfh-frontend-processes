import { locale, processes } from "../../../services";

const { reviewDocuments } = locale.views;

const { states } = processes.changeofname;

const {
  documentsRequestedDes,
  documentsRequestedAppointment,
  documentsAppointmentRescheduled,
  tenureInvestigationFailed,
  tenureInvestigationPassed,
  tenureInvestigationPassedWithInt,
  interviewScheduled,
  interviewRescheduled,
  hoApprovalPassed,
  nameSubmitted,
} = states;

export const changeOfNameDocuments = [
  reviewDocuments.marriageCertificate,
  reviewDocuments.civilPartnershipCertificate,
  reviewDocuments.decreeAbsolute,
  reviewDocuments.finalOrder,
  reviewDocuments.deedPollDocument,
  reviewDocuments.statuoryDeclaration,
];

export const cancelButtonStates = [
  nameSubmitted.state,
  interviewScheduled.state,
  interviewRescheduled.state,
  hoApprovalPassed.state,
];

export const reviewDocumentsStates = [
  documentsRequestedDes.state,
  documentsRequestedAppointment.state,
  documentsAppointmentRescheduled.state,
];

export const tenureInvestigationResultStates = [
  tenureInvestigationFailed.state,
  tenureInvestigationPassed.state,
  tenureInvestigationPassedWithInt.state,
  interviewScheduled.state,
  interviewRescheduled.state,
];
