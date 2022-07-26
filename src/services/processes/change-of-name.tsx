import { IProcess, IStartProcess } from "../../types";
import locale from "../locale";
import { Process, Trigger } from "./types";

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
  processName: Process.ChangeOfName,
  targetType: "person",
  title: locale.views.changeofname.title,
  startProcess,
  states: {
    enterNewName: {
      state: "EnterNewName",
      status: "Awaiting tenant's new name",
      triggers: { enterNewName: "EnterNewName" },
    },
    nameSubmitted: {
      state: "NameSubmitted",
      status: "Awaiting supporting documents through DES",
      triggers: {
        requestDocumentsDES: Trigger.RequestDocumentsDES,
        requestDocumentsAppointment: Trigger.RequestDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentsRequestedDes: {
      state: "DocumentsRequestedDes",
      status: "Awaiting supporting documents through DES",
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        requestDocumentsAppointment: Trigger.RequestDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentsRequestedAppointment: {
      state: "DocumentsRequestedAppointment",
      status: "Awaiting supporting documents appointment",
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        rescheduleDocumentsAppointment: Trigger.RescheduleDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentsAppointmentRescheduled: {
      state: "DocumentsAppointmentRescheduled",
      status: "Awaiting supporting documents appointment",
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        rescheduleDocumentsAppointment: Trigger.RescheduleDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentChecksPassed: {
      state: "DocumentChecksPassed",
      status: "Submit for Tenure investigation",
      triggers: {
        submitApplication: Trigger.SubmitApplication,
        hOApproval: Trigger.HOApproval,
      },
    },
    applicationSubmitted: {
      state: "ApplicationSubmitted",
      status: "Awaiting Tenure investigation",
      triggers: { tenureInvestigation: Trigger.TenureInvestigation },
    },
    tenureInvestigationFailed: {
      state: "TenureInvestigationFailed",
      status: "Awaiting Housing Officer review",
      triggers: {
        hOApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
    },
    tenureInvestigationPassed: {
      state: "TenureInvestigationPassed",
      status: "Awaiting Housing Officer review",
      triggers: {
        hOApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
    },
    tenureInvestigationPassedWithInt: {
      state: "TenureInvestigationPassedWithInt",
      status: "Awaiting Housing Officer review",
      triggers: {
        hOApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
    },
    interviewScheduled: {
      state: "InterviewScheduled",
      status: "Awaiting Tenure Investigation Interview",
      triggers: {
        hOApproval: Trigger.HOApproval,
        rescheduleInterview: Trigger.RescheduleInterview,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    interviewRescheduled: {
      state: "InterviewRescheduled",
      status: "Awaiting Tenure Investigation Interview",
      triggers: { hOApproval: Trigger.HOApproval, cancelProcess: Trigger.CancelProcess },
    },
    hoApprovalFailed: {
      state: "HOApprovalFailed",
      status: "Process Closed",
      triggers: { cancelProcess: Trigger.CancelProcess },
    },
    hoApprovalPassed: {
      state: "HOApprovalPassed",
      status: "Schedule new tenancy signing appointment",
      triggers: {
        scheduleTenureAppointment: Trigger.ScheduleTenureAppointment,
        updateName: Trigger.UpdateName,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    tenureAppointmentScheduled: {
      state: "TenureAppointmentScheduled",
      status: "Awaiting new tenancy signing appointment",
      triggers: {
        rescheduleTenureAppointment: Trigger.RescheduleTenureAppointment,
        updateTenure: Trigger.UpdateName,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    tenureAppointmentRescheduled: {
      state: "TenureAppointmentRescheduled",
      status: "Awaiting new tenancy signing appointment",
      triggers: {
        rescheduleTenureAppointment: Trigger.RescheduleTenureAppointment,
        updateTenure: Trigger.UpdateName,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    nameUpdated: {
      state: "NameUpdated",
      status: "Process completed",
      triggers: {},
    },
    processClosed: {
      state: "ProcessClosed",
      status: "Process Closed",
      triggers: {},
    },
    processCancelled: {
      state: "ProcessCancelled",
      status: "Process Cancelled",
      triggers: {},
    },
  },
};
