export enum Process {
  SoleToJoint = "soletojoint",
  ChangeOfName = "changeofname",
}

export enum Trigger {
  CancelProcess = "CancelProcess",
  CheckTenancyBreach = "CheckTenancyBreach",
  CheckManualEligibility = "CheckManualEligibility",
  CheckAutomatedEligibility = "CheckAutomatedEligibility",
  CloseProcess = "CloseProcess",
  HOApproval = "HOApproval",
  RequestDocumentsAppointment = "RequestDocumentsAppointment",
  RescheduleDocumentsAppointment = "RescheduleDocumentsAppointment",
  ScheduleInterview = "ScheduleInterview",
  RescheduleInterview = "RescheduleInterview",
  ScheduleTenureAppointment = "ScheduleTenureAppointment",
  RescheduleTenureAppointment = "RescheduleTenureAppointment",
  ReviewDocuments = "ReviewDocuments",
  RequestDocumentsDES = "RequestDocumentsDES",
  RequestDocumentsDes = "RequestDocumentsDes",
  SubmitApplication = "SubmitApplication",
  TenureInvestigation = "TenureInvestigation",
  UpdateName = "UpdateName",
  UpdateTenure = "UpdateTenure",
  EnterNewName = "EnterNewName",
  CompleteProcess = "CompleteProcess",
}
