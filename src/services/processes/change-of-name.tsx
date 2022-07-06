import { IProcess, IStartProcess } from "../../types";
import locale from "../locale";

import { Text } from "@mtfh/common/lib/components";

const startProcess: IStartProcess = {
  thirdPartyComponent: () => {
    return (
      <Text>
        By starting this process the tenant must agree that information relating to this
        application can be shared with third parties, for instance to perform a credit
        check.
      </Text>
    );
  },
  thirdPartyCondition:
    "I have explained to the tenant that their information will be shared with third parties.",
  subHeading: locale.supportingDocuments,
  subComponent: () => {
    return (
      <div>
        <Text>
          The applicant will be asked to provide documents as evidence to support their
          application.
        </Text>
      </div>
    );
  },
};

export const changeofname: IProcess = {
  processName: "changeofname",
  targetType: "person",
  title: locale.views.changeofname.title,
  startProcess,
  states: {
    enterNewName: {
      state: "EnterNewName",
      triggers: { enterNewName: "EnterNewName" },
    },
    nameSubmitted: {
      state: "NameSubmitted",
      triggers: {
        requestDocumentsDES: "RequestDocumentsDES",
        requestDocumentsAppointment: "RequestDocumentsAppointment",
        cancelProcess: "CancelProcess",
      },
    },
    documentsRequestedDES: {
      state: "DocumentsRequestedDES",
      triggers: {
        reviewDocuments: "ReviewDocuments",
        requestDocumentsAppointment: "RequestDocumentsAppointment",
        cancelProcess: "CancelProcess",
      },
    },
    documentsRequestedAppointment: {
      state: "DocumentsRequestedAppointment",
      triggers: {
        reviewDocuments: "ReviewDocuments",
        rescheduleDocumentsAppointment: "RescheduleDocumentsAppointment",
        cancelProcess: "CancelProcess",
      },
    },
    documentsAppointmentRescheduled: {
      state: "DocumentsAppointmentRescheduled",
      triggers: {
        reviewDocuments: "ReviewDocuments",
        rescheduleDocumentsAppointment: "RescheduleDocumentsAppointment",
        cancelProcess: "CancelProcess",
      },
    },
    documentChecksPassed: {
      state: "DocumentChecksPassed",
      triggers: { submitApplication: "SubmitApplication", hOApproval: "HOApproval" },
    },
    applicationSubmitted: {
      state: "ApplicationSubmitted",
      triggers: { tenureInvestigation: "TenureInvestigation" },
    },
    tenureInvestigationFailed: {
      state: "TenureInvestigationFailed",
      triggers: { hOApproval: "HOApproval", scheduleInterview: "ScheduleInterview" },
    },
    tenureInvestigationPassed: {
      state: "TenureInvestigationPassed",
      triggers: { hOApproval: "HOApproval", scheduleInterview: "ScheduleInterview" },
    },
    tenureInvestigationPassedWithInt: {
      state: "TenureInvestigationPassedWithInt",
      triggers: { hOApproval: "HOApproval", scheduleInterview: "ScheduleInterview" },
    },
    interviewScheduled: {
      state: "InterviewScheduled",
      triggers: {
        hOApproval: "HOApproval",
        rescheduleInterview: "RescheduleInterview",
        cancelProcess: "CancelProcess",
      },
    },
    interviewRescheduled: {
      state: "InterviewRescheduled",
      triggers: { hOApproval: "HOApproval", cancelProcess: "CancelProcess" },
    },
    hOApprovalFailed: {
      state: "HOApprovalFailed",
      triggers: { cancelProcess: "CancelProcess" },
    },
    hOApprovalPassed: {
      state: "HOApprovalPassed",
      triggers: {
        scheduleTenureAppointment: "ScheduleTenureAppointment",
        updateName: "UpdateName",
        cancelProcess: "CancelProcess",
      },
    },
    nameUpdated: {
      state: "NameUpdated",
      triggers: {},
    },
    processClosed: {
      state: "ProcessClosed",
      triggers: {},
    },
    cancelledProcess: {
      state: "CancelledProcess",
      triggers: {},
    },
  },
};
