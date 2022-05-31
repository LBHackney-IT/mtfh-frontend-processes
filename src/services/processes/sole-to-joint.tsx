import { IProcess, IStartProcess } from "../../types";
import locale from "../locale";

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
  riskHeading: "Sole to joint tenure application risks",
  riskComponent: () => {
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
  processName: "soletojoint",
  targetType: "tenure",
  title: locale.views.soleToJoint.title,
  startProcess,
  states: {
    selectTenants: {
      state: "SelectTenants",
      triggers: { checkAutomatedEligibility: "CheckAutomatedEligibility" },
    },
    automatedChecksFailed: {
      state: "AutomatedChecksFailed",
      triggers: { exitApplication: "ExitApplication" },
    },
    automatedChecksPassed: {
      state: "AutomatedChecksPassed",
      triggers: { checkManualEligibility: "CheckManualEligibility" },
    },
    manualChecksFailed: {
      state: "ManualChecksFailed",
      triggers: { checkManualEligibility: "CheckManualEligibility" },
    },
    manualChecksPassed: {
      state: "ManualChecksPassed",
      triggers: { checkTenancyBreach: "CheckTenancyBreach" },
    },
    breachChecksFailed: {
      state: "BreachChecksFailed",
      triggers: { cancelProcess: "CancelProcess" },
    },
    breachChecksPassed: {
      state: "BreachChecksPassed",
      triggers: {
        requestDocumentsDes: "RequestDocumentsDes",
        requestDocumentsAppointment: "RequestDocumentsAppointment",
      },
    },
    documentsRequestedDes: {
      state: "DocumentsRequestedDes",
      triggers: {
        reviewDocuments: "ReviewDocuments",
        requestDocumentsAppointment: "RequestDocumentsAppointment",
        closeProcess: "CloseProcess",
      },
    },
    documentsRequestedAppointment: {
      state: "DocumentsRequestedAppointment",
      triggers: {
        reviewDocuments: "ReviewDocuments",
        rescheduleDocumentsAppointment: "RescheduleDocumentsAppointment",
        closeProcess: "CloseProcess",
      },
    },
    documentsAppointmentRescheduled: {
      state: "DocumentsAppointmentRescheduled",
      triggers: {
        reviewDocuments: "ReviewDocuments",
        rescheduleDocumentsAppointment: "RescheduleDocumentsAppointment",
        closeProcess: "CloseProcess",
      },
    },
    documentChecksPassed: {
      state: "DocumentChecksPassed",
      triggers: {
        submitApplication: "SubmitApplication",
      },
    },
    applicationSubmitted: {
      state: "ApplicationSubmitted",
      triggers: {
        tenureInvestigation: "TenureInvestigation",
      },
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
