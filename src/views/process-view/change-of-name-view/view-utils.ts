import { locale, processes } from "../../../services";

const { reviewDocuments } = locale.views;

const { states } = processes.changeofname;

const { interviewScheduled, interviewRescheduled, hoApprovalFailed, hoApprovalPassed } =
  states;

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
