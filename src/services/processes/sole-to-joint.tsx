import { IProcess, IStartProcess } from "../../types";
import locale from "../locale";
import { Process, Trigger } from "./types";

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
    selectTenants: {
      state: "SelectTenants",
      status: "Awaiting proposed tenant selection",
      triggers: { checkAutomatedEligibility: Trigger.CheckAutomatedEligibility },
    },
    automatedChecksFailed: {
      state: "AutomatedChecksFailed",
      status: "Process closed - notify resident",
      triggers: { closeProcess: Trigger.CloseProcess },
    },
    automatedChecksPassed: {
      state: "AutomatedChecksPassed",
      status: "Awaiting further eligibility checks",
      triggers: { checkManualEligibility: Trigger.CheckManualEligibility },
    },
    manualChecksFailed: {
      state: "ManualChecksFailed",
      status: "Process closed - notify resident",
      triggers: { checkManualEligibility: Trigger.CheckManualEligibility },
    },
    manualChecksPassed: {
      state: "ManualChecksPassed",
      status: "Awaiting Housing Officer eligibility checks",
      triggers: { checkTenancyBreach: Trigger.CheckTenancyBreach },
    },
    breachChecksFailed: {
      state: "BreachChecksFailed",
      status: "Process closed - notify resident",
      triggers: { cancelProcess: Trigger.CancelProcess },
    },
    breachChecksPassed: {
      state: "BreachChecksPassed",
      status: "Request supporting documents",
      triggers: {
        requestDocumentsDes: Trigger.RequestDocumentsDes,
        requestDocumentsAppointment: Trigger.RequestDocumentsAppointment,
      },
      timeConstraint: 10,
    },
    documentsRequestedDes: {
      state: "DocumentsRequestedDes",
      status: "Awaiting supporting documents through DES",
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        requestDocumentsAppointment: Trigger.RequestDocumentsAppointment,
        closeProcess: Trigger.CloseProcess,
      },
    },
    documentsRequestedAppointment: {
      state: "DocumentsRequestedAppointment",
      status: "Awaiting supporting documents appointment",
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        rescheduleDocumentsAppointment: Trigger.RescheduleDocumentsAppointment,
        closeProcess: Trigger.CloseProcess,
      },
    },
    documentsAppointmentRescheduled: {
      state: "DocumentsAppointmentRescheduled",
      status: "Awaiting supporting documents appointment",
      triggers: {
        reviewDocuments: Trigger.ReviewDocuments,
        rescheduleDocumentsAppointment: Trigger.RescheduleDocumentsAppointment,
        closeProcess: Trigger.CloseProcess,
      },
    },
    documentChecksPassed: {
      state: "DocumentChecksPassed",
      status: "Submit for Tenure investigation",
      triggers: {
        submitApplication: Trigger.SubmitApplication,
      },
    },
    applicationSubmitted: {
      state: "ApplicationSubmitted",
      status: "Awaiting Tenure investigation",
      triggers: {
        tenureInvestigation: Trigger.TenureInvestigation,
      },
      timeConstraint: 5,
    },
    tenureInvestigationFailed: {
      state: "TenureInvestigationFailed",
      status: "Awaiting Housing Officer review",
      triggers: {
        hoApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
      timeConstraint: 2,
    },
    tenureInvestigationPassed: {
      state: "TenureInvestigationPassed",
      status: "Awaiting Housing Officer review",
      triggers: {
        hoApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
      timeConstraint: 2,
    },
    tenureInvestigationPassedWithInt: {
      state: "TenureInvestigationPassedWithInt",
      status: "Awaiting Housing Officer review",
      triggers: {
        hoApproval: Trigger.HOApproval,
        scheduleInterview: Trigger.ScheduleInterview,
      },
      timeConstraint: 2,
    },
    interviewScheduled: {
      state: "InterviewScheduled",
      status: "Awaiting Tenure Investigation Interview",
      triggers: {
        hoApproval: Trigger.HOApproval,
        rescheduleInterview: Trigger.RescheduleInterview,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    interviewRescheduled: {
      state: "InterviewRescheduled",
      status: "Awaiting Tenure Investigation Interview",
      triggers: {
        hoApproval: Trigger.HOApproval,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    hoApprovalFailed: {
      state: "HOApprovalFailed",
      status: "Process Closed",
      triggers: {
        cancelProcess: Trigger.CancelProcess,
      },
    },
    hoApprovalPassed: {
      state: "HOApprovalPassed",
      status: "Schedule new tenancy signing appointment",
      triggers: {
        scheduleTenureAppointment: Trigger.ScheduleTenureAppointment,
        cancelProcess: Trigger.CancelProcess,
      },
      timeConstraint: 2,
    },
    tenureAppointmentScheduled: {
      state: "TenureAppointmentScheduled",
      status: "Awaiting new tenancy signing appointment",
      triggers: {
        rescheduleTenureAppointment: Trigger.RescheduleTenureAppointment,
        updateTenure: Trigger.UpdateTenure,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    tenureAppointmentRescheduled: {
      state: "TenureAppointmentRescheduled",
      status: "Awaiting new tenancy signing appointment",
      triggers: {
        rescheduleTenureAppointment: Trigger.RescheduleTenureAppointment,
        updateTenure: Trigger.UpdateTenure,
        cancelProcess: Trigger.CancelProcess,
      },
    },
    tenureUpdated: {
      state: "TenureUpdated",
      status: "Process completed - notify resident",
      triggers: { completeProcess: Trigger.CompleteProcess },
    },
    processCompleted: {
      state: "ProcessCompleted",
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
