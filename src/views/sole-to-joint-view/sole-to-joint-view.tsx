import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { locale, processes } from "../../services";
import { CheckEliigibilityView, SelectTenantsView } from "./states";

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

const { views } = locale;
const { soleToJoint } = views;

const finishStep = <Step key="step-finish">{soleToJoint.steps.finish}</Step>;

const allSteps = [
  <Step key="step-select-tenant">{soleToJoint.steps.selectTenant}</Step>,
  <Step key="step-personal-details">{soleToJoint.steps.checkEligibility}</Step>,
  <Step key="step-breach-of-tenancy">{soleToJoint.steps.breachOfTenancy}</Step>,
  <Step key="step-request-documents">{soleToJoint.steps.requestDocuments}</Step>,
  <Step key="step-review-documents">{soleToJoint.steps.reviewDocuments}</Step>,
  <Step key="step-submit-case">{soleToJoint.steps.submitCase}</Step>,
  finishStep,
];

const getActiveStep = (state: string, states) => {
  if (state === states.selectTenants.state) {
    return 0;
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
    ].includes(state)
  ) {
    return 2;
  }
  if (state === states.breachChecksPassed.state) {
    return 3;
  }
  return 0;
};

interface SideBarProps {
  state: any;
  states: any;
  furtherEligibilitySubmitted: boolean;
  processId: string;
  processName: string;
}

const SideBar = (props: SideBarProps) => {
  const {
    state,
    states,
    furtherEligibilitySubmitted = false,
    processId,
    processName,
  } = props;

  let activeStep = getActiveStep(state, states);
  let steps: typeof allSteps;
  let startIndex = 0;
  if (activeStep > 2 || (!furtherEligibilitySubmitted && activeStep === 2)) {
    steps = allSteps.slice(2);
    activeStep = activeStep - 2;
    startIndex = 3;
  } else {
    steps = allSteps.slice(0, 2);
    steps.push(finishStep);
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

export const SoleToJointView = () => {
  const { processId } = useParams<{ processId: string }>();

  const processConfig = processes.soletojoint;

  const {
    data: process,
    error,
    mutate,
  } = useProcess({
    id: processId,
    processName: processConfig.processName,
  });

  const [furtherEligibilitySubmitted, setFurtherEligibilitySubmitted] =
    useState<boolean>(false);

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

  const { currentState } = process;
  const { state } = currentState;

  const { states } = processConfig;
  const {
    selectTenants,
    automatedChecksFailed,
    automatedChecksPassed,
    manualChecksFailed,
    manualChecksPassed,
    breachChecksPassed,
    breachChecksFailed,
    processCancelled,
  } = states;

  const components = {
    [selectTenants.state]: SelectTenantsView,
    [automatedChecksFailed.state]: CheckEliigibilityView,
    [automatedChecksPassed.state]: CheckEliigibilityView,
    [manualChecksFailed.state]: CheckEliigibilityView,
    [manualChecksPassed.state]: CheckEliigibilityView,
    [breachChecksFailed.state]: CheckEliigibilityView,
    [breachChecksPassed.state]: CheckEliigibilityView,
    [processCancelled.state]: CheckEliigibilityView,
  };

  const Component = components[state];

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
          state={state}
          states={states}
          furtherEligibilitySubmitted={furtherEligibilitySubmitted}
          processId={processId}
          processName={processConfig.processName}
        />
      }
    >
      <Component
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={{ furtherEligibilitySubmitted, setFurtherEligibilitySubmitted }}
      />
    </Layout>
  );
};
