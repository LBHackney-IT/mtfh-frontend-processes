import { IProcess, IStartProcess } from "../../types";
import locale from "../locale";
import { Process, State, Status, Trigger } from "./types";

import { Heading, Link, List, Text } from "@mtfh/common/lib/components";

const startProcess: IStartProcess = {
  thirdPartyComponent: () => {
    return (
      <Text>
        By starting this process the tenant and proposed tenant must agree that
        information relating to this application will be shared with third parties, for
        instance to perform a credit check.
      </Text>
    );
  },
  thirdPartyCondition:
    "I have explained to the tenant and proposed tenant that their information will be shared with third parties.",
  subHeading: "Sole to joint tenure application risks",
  subComponent: () => {
    return (
      <div>
        <Text>
          A joint tenancy is when two or more adults (aged 18 or over) are named on the
          tenure agreement. Joint tenants have equal rights and responsibilities under the
          tenure agreement for the duration of the tenancy.
        </Text>
        <Text>
          Joint tenants are both responsible, together and individually, for keeping to
          these tenure conditions and payments to the London borough of Hackney. Applying
          for a joint tenancy is at the discretion of the Housing team.
        </Text>
        <Heading variant="h4">Things to consider if joint tenants separate</Heading>
        <Text>
          If a joint tenants relationship ends, discussions should be made about what will
          happen to the tenure.
        </Text>
        <Text>The tenant and proposed tenant need to understand:</Text>
        <List variant="bullets">
          <Text>When can they end a joint tenure</Text>
          <Text>
            What will happen if they end a joint tenure but one of the tenants remains at
            the property
          </Text>
        </List>
        <Text>
          This information is available on the{" "}
          <Link isExternal href="https://hackney.gov.uk/your-tenancy-agreement">
            terms and conditions of the tenancy
          </Link>
        </Text>
      </div>
    );
  },
};

export const soletojoint: IProcess = {
  processName: Process.SoleToJoint,
  name: locale.processes.soletojoint.name,
  targetType: "tenure",
  title: locale.views.soleToJoint.title,
  startProcess,
  states: {
    applicationInitialised: {
      state: State.ApplicationInitialised,
      status: Status.AwaitingProposedTenantSelection,
      triggers: { checkAutomatedEligibility: Trigger.CheckAutomatedEligibility },
    },
    selectTenants: {
      state: State.SelectTenants,
      status: Status.AwaitingProposedTenantSelection,
      triggers: { checkAutomatedEligibility: Trigger.CheckAutomatedEligibility },
    },
    automatedChecksFailed: {
      state: State.AutomatedChecksFailed,
      status: Status.ProcessClosedNotify,
      triggers: { closeProcess: Trigger.CloseProcess },
    },
    automatedChecksPassed: {
      state: State.AutomatedChecksPassed,
      status: Status.AwaitingFurtherEligibilityChecks,
      triggers: { checkManualEligibility: Trigger.CheckManualEligibility },
    },
    manualChecksFailed: {
      state: State.ManualChecksFailed,
      status: Status.ProcessClosedNotify,
      triggers: { checkManualEligibility: Trigger.CheckManualEligibility },
    },
    manualChecksPassed: {
      state: State.ManualChecksPassed,
      status: Status.AwaitingHOEligibilityChecks,
      triggers: { checkTenancyBreach: Trigger.CheckTenancyBreach },
    },
    breachChecksFailed: {
      state: State.BreachChecksFailed,
      status: Status.ProcessClosedNotify,
      triggers: { cancelProcess: Trigger.CancelProcess },
    },
    breachChecksPassed: {
      state: State.BreachChecksPassed,
      status: Status.RequestSupportingDocuments,
      triggers: {
        requestDocumentsDes: Trigger.RequestDocumentsDes,
        requestDocumentsAppointment: Trigger.RequestDocumentsAppointment,
      },
      timeConstraint: 10,
    },
    documentsRequestedDes: {
      state: State.DocumentsRequestedDes,
      status: Status.AwaitingSupportingDocumentsDES,
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        requestDocumentsAppointment: Trigger.RequestDocumentsAppointment,
        closeProcess: Trigger.CloseProcess,
      },
    },
    documentsRequestedAppointment: {
      state: State.DocumentsRequestedAppointment,
      status: Status.AwaitingSupportingDocumentsAppointment,
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        rescheduleDocumentsAppointment: Trigger.RescheduleDocumentsAppointment,
        closeProcess: Trigger.CloseProcess,
      },
    },
    documentsAppointmentRescheduled: {
      state: State.DocumentsAppointmentRescheduled,
      status: Status.AwaitingSupportingDocumentsAppointment,
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        rescheduleDocumentsAppointment: Trigger.RescheduleDocumentsAppointment,
        closeProcess: Trigger.CloseProcess,
      },
    },
    documentChecksPassed: {
      state: State.DocumentChecksPassed,
      status: Status.SubmitForTI,
      triggers: {
        submitApplication: Trigger.SubmitApplication,
      },
    },
    applicationSubmitted: {
      state: State.ApplicationSubmitted,
      status: Status.AwaitingTI,
      triggers: {
        tenureInvestigation: Trigger.TenureInvestigation,
      },
      timeConstraint: 5,
    },
    tenureInvestigationFailed: {
      state: State.TenureInvestigationFailed,
      status: Status.AwaitingHOReview,
      triggers: {
        hoApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
      timeConstraint: 2,
    },
    tenureInvestigationPassed: {
      state: State.TenureInvestigationPassed,
      status: Status.AwaitingHOReview,
      triggers: {
        hoApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
      timeConstraint: 2,
    },
    tenureInvestigationPassedWithInt: {
      state: State.TenureInvestigationPassedWithInt,
      status: Status.AwaitingHOReview,
      triggers: {
        hoApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
      timeConstraint: 2,
    },
    interviewScheduled: {
      state: State.InterviewScheduled,
      status: Status.AwaitingTIInterview,
      triggers: {
        hoApproval: Trigger.HOApproval,
        rescheduleInterview: Trigger.RescheduleInterview,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    interviewRescheduled: {
      state: State.InterviewRescheduled,
      status: Status.AwaitingTIInterview,
      triggers: {
        hoApproval: Trigger.HOApproval,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    hoApprovalFailed: {
      state: State.HOApprovalFailed,
      status: Status.ProcessClosedNotify,
      triggers: {
        cancelProcess: Trigger.CancelProcess,
      },
    },
    hoApprovalPassed: {
      state: State.HOApprovalPassed,
      status: Status.ScheduleTenancySigningAppointment,
      triggers: {
        scheduleTenureAppointment: Trigger.ScheduleTenureAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
      timeConstraint: 2,
    },
    tenureAppointmentScheduled: {
      state: State.TenureAppointmentScheduled,
      status: Status.AwaitingTenancySigningAppointment,
      triggers: {
        rescheduleTenureAppointment: Trigger.RescheduleTenureAppointment,
        updateTenure: Trigger.UpdateTenure,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    tenureAppointmentRescheduled: {
      state: State.TenureAppointmentRescheduled,
      status: Status.AwaitingTenancySigningAppointment,
      triggers: {
        rescheduleTenureAppointment: Trigger.RescheduleTenureAppointment,
        updateTenure: Trigger.UpdateTenure,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    tenureUpdated: {
      state: State.TenureUpdated,
      status: Status.ProcessCompletedNotify,
      triggers: { completeProcess: Trigger.CompleteProcess },
    },
    processCompleted: {
      state: State.ProcessCompleted,
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
