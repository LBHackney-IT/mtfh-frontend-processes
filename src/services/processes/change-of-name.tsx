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
      triggers: { enterNewName: "EnterNewName" },
    },
    nameSubmitted: {
      state: "NameSubmitted",
      triggers: {
        requestDocumentsDES: Trigger.RequestDocumentsDES,
        requestDocumentsAppointment: Trigger.RequestDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentsRequestedDes: {
      state: "DocumentsRequestedDes",
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        requestDocumentsAppointment: Trigger.RequestDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentsRequestedAppointment: {
      state: "DocumentsRequestedAppointment",
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        rescheduleDocumentsAppointment: Trigger.RescheduleDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentsAppointmentRescheduled: {
      state: "DocumentsAppointmentRescheduled",
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        rescheduleDocumentsAppointment: Trigger.RescheduleDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentChecksPassed: {
      state: "DocumentChecksPassed",
      triggers: {
        submitApplication: Trigger.SubmitApplication,
        hOApproval: Trigger.HOApproval,
      },
    },
    applicationSubmitted: {
      state: "ApplicationSubmitted",
      triggers: { tenureInvestigation: Trigger.TenureInvestigation },
    },
    tenureInvestigationFailed: {
      state: "TenureInvestigationFailed",
      triggers: {
        hOApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
    },
    tenureInvestigationPassed: {
      state: "TenureInvestigationPassed",
      triggers: {
        hOApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
    },
    tenureInvestigationPassedWithInt: {
      state: "TenureInvestigationPassedWithInt",
      triggers: {
        hOApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
    },
    interviewScheduled: {
      state: "InterviewScheduled",
      triggers: {
        hOApproval: Trigger.HOApproval,
        rescheduleInterview: Trigger.RescheduleInterview,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    interviewRescheduled: {
      state: "InterviewRescheduled",
      triggers: { hOApproval: Trigger.HOApproval, cancelProcess: Trigger.CancelProcess },
    },
    hoApprovalFailed: {
      state: "HOApprovalFailed",
      triggers: { cancelProcess: Trigger.CancelProcess },
    },
    hoApprovalPassed: {
      state: "HOApprovalPassed",
      triggers: {
        scheduleTenureAppointment: Trigger.ScheduleTenureAppointment,
        updateName: Trigger.UpdateName,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    tenureAppointmentScheduled: {
      state: "TenureAppointmentScheduled",
      triggers: {
        rescheduleTenureAppointment: Trigger.RescheduleTenureAppointment,
        updateTenure: Trigger.UpdateName,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    tenureAppointmentRescheduled: {
      state: "TenureAppointmentRescheduled",
      triggers: {
        rescheduleTenureAppointment: Trigger.RescheduleTenureAppointment,
        updateTenure: Trigger.UpdateName,
        cancelProcess: Trigger.CancelProcess,
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
    processCancelled: {
      state: "ProcessCancelled",
      triggers: {},
    },
  },
};
