import { locale, processes } from "../../../services";

const { reviewDocuments } = locale.views;

const { states } = processes.changeofname;

const {
  interviewScheduled,
  interviewRescheduled,
  hoApprovalFailed,
  hoApprovalPassed,
  documentsRequestedDes,
  documentsRequestedAppointment,
  documentsAppointmentRescheduled,
  tenureInvestigationFailed,
  tenureInvestigationPassed,
  tenureInvestigationPassedWithInt,
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
  interviewScheduled.state,
  interviewRescheduled.state,
  hoApprovalFailed.state,
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
