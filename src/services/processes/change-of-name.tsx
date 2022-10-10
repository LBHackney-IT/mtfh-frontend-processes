import { IProcess, IStartProcess } from "../../types";
import locale from "../locale";
import { Process, State, Status, Trigger } from "./types";

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
  name: locale.processes.changeofname.name,
  targetType: "person",
  title: locale.views.changeofname.title,
  startProcess,
  states: {
    enterNewName: {
      state: State.EnterNewName,
      status: Status.AwaitingTenantsNewName,
      triggers: { enterNewName: Trigger.EnterNewName },
    },
    nameSubmitted: {
      state: State.NameSubmitted,
      status: Status.AwaitingSupportingDocumentsDES,
      triggers: {
        requestDocumentsDES: Trigger.RequestDocumentsDES,
        requestDocumentsAppointment: Trigger.RequestDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentsRequestedDes: {
      state: State.DocumentsRequestedDes,
      status: Status.AwaitingSupportingDocumentsDES,
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        requestDocumentsAppointment: Trigger.RequestDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentsRequestedAppointment: {
      state: State.DocumentsRequestedAppointment,
      status: Status.AwaitingSupportingDocumentsAppointment,
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        rescheduleDocumentsAppointment: Trigger.RescheduleDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentsAppointmentRescheduled: {
      state: State.DocumentsAppointmentRescheduled,
      status: Status.AwaitingSupportingDocumentsAppointment,
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        rescheduleDocumentsAppointment: Trigger.RescheduleDocumentsAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    documentChecksPassed: {
      state: State.DocumentChecksPassed,
      status: Status.SubmitForTI,
      triggers: {
        submitApplication: Trigger.SubmitApplication,
        hOApproval: Trigger.HOApproval,
      },
    },
    applicationSubmitted: {
      state: State.ApplicationSubmitted,
      status: Status.AwaitingTI,
      triggers: { tenureInvestigation: Trigger.TenureInvestigation },
    },
    tenureInvestigationFailed: {
      state: State.TenureInvestigationFailed,
      status: Status.AwaitingHOReview,
      triggers: {
        hOApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
    },
    tenureInvestigationPassed: {
      state: State.TenureInvestigationPassed,
      status: Status.AwaitingHOReview,
      triggers: {
        hOApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
    },
    tenureInvestigationPassedWithInt: {
      state: State.TenureInvestigationPassedWithInt,
      status: Status.AwaitingHOReview,
      triggers: {
        hOApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
    },
    interviewScheduled: {
      state: State.InterviewScheduled,
      status: Status.AwaitingTIInterview,
      triggers: {
        hOApproval: Trigger.HOApproval,
        rescheduleInterview: Trigger.RescheduleInterview,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    interviewRescheduled: {
      state: State.InterviewRescheduled,
      status: Status.AwaitingTIInterview,
      triggers: { hOApproval: Trigger.HOApproval, cancelProcess: Trigger.CancelProcess },
    },
    hoApprovalFailed: {
      state: State.HOApprovalFailed,
      status: Status.ProcessClosedNotify,
      triggers: { cancelProcess: Trigger.CancelProcess },
    },
    hoApprovalPassed: {
      state: State.HOApprovalPassed,
      status: Status.ScheduleTenancySigningAppointment,
      triggers: {
        scheduleTenureAppointment: Trigger.ScheduleTenureAppointment,
        updateName: Trigger.UpdateName,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    tenureAppointmentScheduled: {
      state: State.TenureAppointmentScheduled,
      status: Status.AwaitingTenancySigningAppointment,
      triggers: {
        rescheduleTenureAppointment: Trigger.RescheduleTenureAppointment,
        updateTenure: Trigger.UpdateName,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    tenureAppointmentRescheduled: {
      state: State.TenureAppointmentRescheduled,
      status: Status.AwaitingTenancySigningAppointment,
      triggers: {
        rescheduleTenureAppointment: Trigger.RescheduleTenureAppointment,
        updateTenure: Trigger.UpdateName,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    nameUpdated: {
      state: State.NameUpdated,
      status: Status.ProcessCompleted,
      triggers: {},
    },
    processClosed: {
      state: State.ProcessClosed,
      status: Status.ProcessClosed,
      triggers: {},
    },
    processCancelled: {
      state: State.ProcessCancelled,
      status: Status.ProcessCancelled,
      triggers: {},
    },
  },
};
