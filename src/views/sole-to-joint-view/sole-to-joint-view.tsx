import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { locale, processes } from "../../services";
import {
  BreachChecksFailedView,
  CheckEligibilityView,
  RequestDcoumentsView,
  ReviewDocumentsView,
  SelectTenantsView,
  SubmitCaseView,
  TenureInvestigationView,
} from "./states";
import { ManualChecksFailedView } from "./states/manual-checks-view";

import { useProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  ErrorSummary,
  Layout,
  Spinner,
  Step,
  Stepper,
} from "@mtfh/common/lib/components";

const processConfig = processes.soletojoint;

const { states } = processConfig;
const {
  selectTenants,
  automatedChecksFailed,
  automatedChecksPassed,
  manualChecksFailed,
  manualChecksPassed,
  breachChecksPassed,
  breachChecksFailed,
  documentsRequestedDes,
  documentsRequestedAppointment,
  documentsAppointmentRescheduled,
  documentChecksPassed,
  applicationSubmitted,
  hoApprovalPassed,
  tenureAppointmentScheduled,
  tenureAppointmentRescheduled,
  processCancelled,
  processClosed,
} = states;

const components = {
  [selectTenants.state]: SelectTenantsView,
  [automatedChecksFailed.state]: CheckEligibilityView,
  [automatedChecksPassed.state]: CheckEligibilityView,
  [manualChecksFailed.state]: ManualChecksFailedView,
  [manualChecksPassed.state]: CheckEligibilityView,
  [breachChecksFailed.state]: BreachChecksFailedView,
  [breachChecksPassed.state]: RequestDcoumentsView,
  [documentsRequestedDes.state]: ReviewDocumentsView,
  [documentsRequestedAppointment.state]: ReviewDocumentsView,
  [documentsAppointmentRescheduled.state]: ReviewDocumentsView,
  [documentChecksPassed.state]: ReviewDocumentsView,
  [applicationSubmitted.state]: SubmitCaseView,
  [hoApprovalPassed.state]: TenureInvestigationView,
  [tenureAppointmentScheduled.state]: TenureInvestigationView,
  [tenureAppointmentRescheduled.state]: TenureInvestigationView,
  [processCancelled.state]: SubmitCaseView,
  [processClosed.state]: CheckEligibilityView,
};

const { views } = locale;
const { soleToJoint } = views;

const getActiveStep = (process: any, states, submitted: boolean, closeCase: boolean) => {
  const {
    currentState: { state },
    currentState,
  } = process;

  if (state === states.selectTenants.state) {
    return 0;
  }

  if (isSameState(currentState, states.processClosed)) {
    const previousState = getPreviousState(process);
    if (isSameState(previousState, states.manualChecksFailed)) {
      return 1;
    }
    if (isSameState(previousState, states.breachChecksFailed)) {
      return 2;
    }
  }

  if (
    [
      states.automatedChecksPassed.state,
      states.automatedChecksFailed.state,
      states.manualChecksFailed.state,
    ].includes(state)
  ) {
    return 1;
  }
  if (
    [
      states.manualChecksPassed.state,
      states.breachChecksFailed.state,
      states.processCancelled.state,
    ].includes(state) ||
    (states.manualChecksPassed.state === state && submitted)
  ) {
    return 2;
  }
  if (state === states.breachChecksPassed.state) {
    return 3;
  }
  if (
    [
      states.documentsRequestedDes.state,
      states.documentsRequestedAppointment.state,
      states.documentsAppointmentRescheduled.state,
      states.processClosed.state,
    ].includes(state)
  ) {
    return 4;
  }
  if (
    state === states.documentChecksPassed.state ||
    (states.applicationSubmitted.state === state && submitted)
  ) {
    return 5;
  }
  if (
    [
      states.applicationSubmitted.state,
      states.hoApprovalPassed.state,
      states.tenureAppointmentScheduled.state,
      states.tenureAppointmentRescheduled.state,
    ].includes(state)
  ) {
    return 6;
  }
  if ([states.tenureAppointmentRescheduled.state].includes(state) && closeCase) {
    return 7;
  }
  return 0;
};

interface SideBarProps {
  process: any;
  states: any;
  submitted: boolean;
  closeCase: boolean;
  processId: string;
  processName: string;
}

const SideBar = ({
  process,
  states,
  submitted = false,
  closeCase = false,
  processId,
  processName,
}: SideBarProps): JSX.Element => {
  let activeStep = getActiveStep(process, states, submitted, closeCase);
  let steps: JSX.Element[];
  let startIndex = 0;
  if (activeStep > 5) {
    steps = [
      <Step key="step-review-application">{soleToJoint.steps.reviewApplication}</Step>,
      <Step key="step-end-case">{soleToJoint.steps.endCase}</Step>,
    ];
    activeStep = activeStep - 6;
    startIndex = 10;
  } else if (activeStep > 2 || (!submitted && activeStep === 2)) {
    steps = [
      <Step key="step-breach-of-tenancy">{soleToJoint.steps.breachOfTenancy}</Step>,
      <Step key="step-request-documents">{soleToJoint.steps.requestDocuments}</Step>,
      <Step key="step-review-documents">{soleToJoint.steps.reviewDocuments}</Step>,
      <Step key="step-submit-case">{soleToJoint.steps.submitCase}</Step>,
    ];
    activeStep = activeStep - 2;
    startIndex = 3;
  } else {
    steps = [
      <Step key="step-select-tenant">{soleToJoint.steps.selectTenant}</Step>,
      <Step key="step-personal-details">{soleToJoint.steps.checkEligibility}</Step>,
      <Step key="step-finish">{soleToJoint.steps.finish}</Step>,
    ];
  }
  return (
    <>
      <Stepper
        data-testid="mtfh-stepper-sole-to-joint"
        activeStep={activeStep}
        startIndex={startIndex}
      >
        {steps}
      </Stepper>
      <Button variant="secondary">{soleToJoint.actions.reassignCase}</Button>
      <Button variant="secondary">{soleToJoint.actions.cancelProcess}</Button>
      <Button
        variant="secondary"
        as={RouterLink}
        to={`/activities/process/${processName}/${processId}`}
      >
        {soleToJoint.actions.caseActivityHistory}
      </Button>
    </>
  );
};

const isSameState = (firstState, secondState) => {
  return firstState.state === secondState.state;
};

const getPreviousState = (process) => {
  const { previousStates } = process;
  return previousStates[previousStates.length - 1];
};

const getComponent = (process) => {
  const {
    currentState: { state },
  } = process;

  let Component;

  if (state === processConfig.states.processClosed.state) {
    const previousState = getPreviousState(process);
    if (isSameState(previousState, processConfig.states.manualChecksFailed)) {
      Component = ManualChecksFailedView;
    } else if (isSameState(previousState, processConfig.states.breachChecksFailed)) {
      Component = BreachChecksFailedView;
    }
  }

  if (!Component) {
    Component = components[state];
  }

  return Component;
};

export const SoleToJointView = () => {
  const { processId } = useParams<{ processId: string }>();

  const {
    data: process,
    error,
    mutate,
  } = useProcess({
    id: processId,
    processName: processConfig.processName,
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [closeCase, setCloseCase] = useState<boolean>(false);

  if (error) {
    return (
      <ErrorSummary
        id="sole-to-joint-view"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!process) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const Component = getComponent(process);

  if (!Component) {
    return (
      <ErrorSummary
        id="sole-to-joint-view"
        title={locale.errors.unableToFindState}
        description={locale.errors.unableToFindStateDescription}
      />
    );
  }

  return (
    <Layout
      data-testid="soletojoint"
      sidePosition="right"
      side={
        <SideBar
          process={process}
          states={states}
          submitted={submitted}
          closeCase={closeCase}
          processId={processId}
          processName={processConfig.processName}
        />
      }
    >
      <Component
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />
    </Layout>
  );
};
