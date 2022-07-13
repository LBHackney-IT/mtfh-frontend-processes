import { locale } from "../../../services";

const { reviewDocuments } = locale.views;

export const changeOfNameDocuments = [
  reviewDocuments.marriageCertificate,
  reviewDocuments.civilPartnershipCertificate,
  reviewDocuments.decreeAbsolute,
  reviewDocuments.finalOrder,
  reviewDocuments.deedPollDocument,
  reviewDocuments.statuoryDeclaration,
];
