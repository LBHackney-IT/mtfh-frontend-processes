import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { CloseProcessView, SoleToJointHeader } from "../../../components";
import { CloseCaseButton } from "../../../components/close-case-button/close-case-button";
import { locale, processes } from "../../../services";
import { ProcessComponentProps, ProcessSideBarProps } from "../../../types";
import { getPreviousState, isSameState } from "../../../utils/processUtil";
import {
  BreachChecksFailedView,
  BreachChecksView,
  CheckEligibilityView,
  RequestDocumentsView,
  ReviewDocumentsView,
  SelectTenantsView,
  SubmitCaseView,
} from "./states";
import { ManualChecksFailedView } from "./states/manual-checks-view";
import { ReviewApplicationView } from "./states/review-application-view/review-application-view";
import { reviewDocumentsStates } from "./view-utils";

import { Button, ErrorSummary, Step, Stepper } from "@mtfh/common/lib/components";
import { useFeatureToggle } from "@mtfh/common/lib/hooks";

import "./styles.scss";

const { views } = locale;
const { soleToJoint } = views;
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
  documentChecksPassed,
  applicationSubmitted,
  tenureInvestigationFailed,
  tenureInvestigationPassed,
  tenureInvestigationPassedWithInt,
  interviewScheduled,
  interviewRescheduled,
  hoApprovalPassed,
  hoApprovalFailed,
  tenureAppointmentScheduled,
  tenureAppointmentRescheduled,
  tenureUpdated,
  processCancelled,
  processClosed,
} = states;

const reviewDocumentsViewByStates = {};
reviewDocumentsStates.forEach((state) => {
  reviewDocumentsViewByStates[state] = ReviewDocumentsView;
});

const components = {
  [selectTenants.state]: SelectTenantsView,
  [automatedChecksFailed.state]: CheckEligibilityView,
  [automatedChecksPassed.state]: CheckEligibilityView,
  [manualChecksFailed.state]: ManualChecksFailedView,
  [manualChecksPassed.state]: BreachChecksView,
  [breachChecksFailed.state]: BreachChecksFailedView,
  [breachChecksPassed.state]: RequestDocumentsView,
  ...reviewDocumentsViewByStates,
  [documentChecksPassed.state]: SubmitCaseView,
  [applicationSubmitted.state]: ReviewApplicationView,
  [tenureInvestigationFailed.state]: ReviewApplicationView,
  [tenureInvestigationPassed.state]: ReviewApplicationView,
  [tenureInvestigationPassedWithInt.state]: ReviewApplicationView,
  [interviewScheduled.state]: ReviewApplicationView,
  [interviewRescheduled.state]: ReviewApplicationView,
  [hoApprovalPassed.state]: ReviewApplicationView,
  [hoApprovalFailed.state]: ReviewApplicationView,
  [tenureAppointmentScheduled.state]: ReviewApplicationView,
  [tenureAppointmentRescheduled.state]: ReviewApplicationView,
  [tenureUpdated.state]: ReviewApplicationView,
  [processCancelled.state]: SubmitCaseView,
  [processClosed.state]: CheckEligibilityView,
};

const getActiveStep = (
  process: any,
  states,
  submitted: boolean,
  closeProcessReason?: string,
) => {
  const {
    currentState: { state },
  } = process;

  if (state === states.selectTenants.state) {
    return 0;
  }

  if ([processCancelled.state, processClosed.state].includes(state)) {
    const previousState = getPreviousState(process);
    if (
      [
        manualChecksFailed.state,
        automatedChecksPassed.state,
        automatedChecksFailed.state,
      ].includes(previousState.state)
    ) {
      return 1;
    }
    if (
      [
        manualChecksPassed.state,
        breachChecksFailed.state,
        breachChecksPassed.state,
      ].includes(previousState.state)
    ) {
      return 2;
    }
    if (
      [
        hoApprovalFailed.state,
        interviewScheduled.state,
        interviewRescheduled.state,
        hoApprovalPassed.state,
        tenureInvestigationPassed.state,
        tenureAppointmentScheduled.state,
        tenureAppointmentRescheduled.state,
      ].includes(previousState.state)
    ) {
      return 7;
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
  if (state === states.documentChecksPassed.state) {
    return 5;
  }
  if (
    [
      states.applicationSubmitted.state,
      states.tenureInvestigationFailed.state,
      states.tenureInvestigationPassed.state,
      states.tenureInvestigationPassedWithInt.state,
      states.interviewScheduled.state,
      states.interviewRescheduled.state,
      states.hoApprovalPassed.state,
      states.tenureAppointmentScheduled.state,
      states.tenureAppointmentRescheduled.state,
    ].includes(state) ||
    (states.applicationSubmitted.state === state && submitted)
  ) {
    if (closeProcessReason) {
      return 7;
    }
    return 6;
  }
  if ([states.tenureUpdated.state, states.hoApprovalFailed.state].includes(state)) {
    return 7;
  }
  return 0;
};

export const SoleToJointSideBar = (props: ProcessSideBarProps) => {
  const hasReassignCase = useFeatureToggle("MMH.ReassignCase");
  const {
    process,
    process: {
      id: processId,
      processName,
      currentState: { state },
    },
    submitted = false,
    closeProcessReason,
    setCloseProcessDialogOpen,
    setCancel,
  } = props;

  let activeStep = getActiveStep(process, states, submitted, closeProcessReason);
  let steps: JSX.Element[];
  let startIndex = 0;
  if (activeStep > 6 || (!submitted && activeStep === 6)) {
    steps = [
      <Step key="step-review-application">{soleToJoint.steps.reviewApplication}</Step>,
      <Step key="step-end-case">{soleToJoint.steps.endCase}</Step>,
    ];
    activeStep = activeStep - 6;
    startIndex = 10;
  } else if (
    activeStep > 2 ||
    (!submitted && processCancelled.state !== state && activeStep === 2)
  ) {
    steps = [
      <Step key="step-breach-of-tenancy">{soleToJoint.steps.breachOfTenancy}</Step>,
      <Step key="step-request-documents">{soleToJoint.steps.requestDocuments}</Step>,
      <Step key="step-review-documents">{soleToJoint.steps.reviewDocuments}</Step>,
      <Step key="step-submit-case">{soleToJoint.steps.submitCase}</Step>,
      <Step key="step-finish">{soleToJoint.steps.finish}</Step>,
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
      {hasReassignCase && (
        <Button variant="secondary">{soleToJoint.actions.reassignCase}</Button>
      )}
      {[
        automatedChecksPassed.state,
        manualChecksPassed.state,
        breachChecksPassed.state,
        tenureInvestigationPassed.state,
        interviewScheduled.state,
        interviewRescheduled.state,
        hoApprovalPassed.state,
        tenureAppointmentScheduled.state,
        tenureAppointmentRescheduled.state,
      ].includes(state) &&
        !closeProcessReason && (
          <Button
            variant="secondary"
            onClick={() => {
              setCancel(true);
              setCloseProcessDialogOpen(true);
            }}
          >
            {soleToJoint.actions.cancelProcess}
          </Button>
        )}
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

const getComponent = (process) => {
  const {
    currentState: { state },
  } = process;

  if ([processCancelled.state, processClosed.state].includes(state)) {
    const previousState = getPreviousState(process);
    if (isSameState(previousState, manualChecksFailed)) {
      return ManualChecksFailedView;
    }
    if (isSameState(previousState, breachChecksFailed)) {
      return BreachChecksFailedView;
    }
    return components[previousState.state];
  }
  return components[state];
};

export const SoleToJointView = ({ process, mutate, optional }: ProcessComponentProps) => {
  const {
    closeProcessReason,
    submitted,
    setSubmitted,
    setCloseProcessDialogOpen,
    isCancel,
  } = optional;

  const Component = getComponent(process);

  if (!Component) {
    return (
      <ErrorSummary
        id="sole-to-joint-view"
        data-testid="error-sole-to-joint-view"
        title={locale.errors.unableToFindState}
        description={locale.errors.unableToFindStateDescription}
      />
    );
  }

  return (
    <>
      <SoleToJointHeader processConfig={processConfig} process={process} />
      <Component
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={{
          submitted,
          setSubmitted,
          closeProcessReason,
          setCloseProcessDialogOpen,
        }}
      />

      {(closeProcessReason ||
        [
          processClosed.state,
          processCancelled.state,
          automatedChecksFailed.state,
          breachChecksFailed.state,
          manualChecksFailed.state,
          hoApprovalFailed.state,
        ].includes(process.currentState.state)) && (
        <CloseProcessView
          closeProcessReason={closeProcessReason}
          process={process}
          processConfig={processConfig}
          mutate={mutate}
          isCancel={isCancel}
        />
      )}

      {!closeProcessReason &&
        reviewDocumentsStates.includes(process.currentState.state) && (
          <CloseCaseButton setCloseProcessDialogOpen={setCloseProcessDialogOpen} />
        )}
    </>
  );
};
