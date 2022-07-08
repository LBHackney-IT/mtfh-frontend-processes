import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale, processes } from "../../../services";
import { ProcessComponentProps, ProcessSideBarProps } from "../../../types";
import {
  BreachChecksFailedView,
  BreachChecksView,
  CheckEligibilityView,
  CloseProcessView,
  RequestDocumentsView,
  ReviewDocumentsView,
  SelectTenantsView,
  SubmitCaseView,
} from "./states";
import { ManualChecksFailedView } from "./states/manual-checks-view";
import { ReviewApplicationView } from "./states/review-application-view/review-application-view";

import {
  Box,
  Button,
  ErrorSummary,
  StatusHeading,
  Step,
  Stepper,
  Text,
} from "@mtfh/common/lib/components";

import "./styles.scss";

const { views } = locale;
const { soleToJoint, reviewDocuments } = views;
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

const reviewDocumentsViewByStates = {
  [documentsRequestedDes.state]: ReviewDocumentsView,
  [documentsRequestedAppointment.state]: ReviewDocumentsView,
  [documentsAppointmentRescheduled.state]: ReviewDocumentsView,
};

const reviewDocumentsPageStates = Object.keys(reviewDocumentsViewByStates);

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
  [applicationSubmitted.state]: SubmitCaseView,
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
    if (
      isSameState(previousState, states.manualChecksFailed) ||
      isSameState(previousState, states.automatedChecksFailed)
    ) {
      return 1;
    }
    if (isSameState(previousState, states.breachChecksFailed)) {
      return 2;
    }
    if (isSameState(previousState, states.hoApprovalFailed)) {
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
    if (closeCase) {
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
  const {
    process,
    process: {
      currentState: { state, id: processId, processName },
    },
    submitted = false,
    closeCase = false,
    setCloseProcessDialogOpen,
    setCancel,
  } = props;

  let activeStep = getActiveStep(process, states, submitted, closeCase);
  let steps: JSX.Element[];
  let startIndex = 0;
  if (activeStep > 6 || (!submitted && activeStep === 6)) {
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
      <Button variant="secondary">{soleToJoint.actions.reassignCase}</Button>
      {([
        states.interviewScheduled.state,
        states.interviewRescheduled.state,
        states.hoApprovalFailed.state,
        states.hoApprovalPassed.state,
        states.tenureAppointmentScheduled.state,
      ].includes(state) ||
        (states.tenureAppointmentRescheduled.state === state && !closeCase)) && (
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

  if (state === processConfig.states.processClosed.state) {
    const previousState = getPreviousState(process);
    if (isSameState(previousState, manualChecksFailed)) {
      return ManualChecksFailedView;
    }
    if (isSameState(previousState, automatedChecksFailed)) {
      return CheckEligibilityView;
    }
    if (isSameState(previousState, breachChecksFailed)) {
      return BreachChecksFailedView;
    }
    if (
      isSameState(previousState, documentsRequestedDes) ||
      isSameState(previousState, documentsRequestedAppointment) ||
      isSameState(previousState, documentsAppointmentRescheduled)
    ) {
      return ReviewDocumentsView;
    }
    if (isSameState(previousState, hoApprovalFailed)) {
      return ReviewApplicationView;
    }
  }
  return components[state];
};

export const SoleToJointView = ({ process, mutate, optional }: ProcessComponentProps) => {
  const {
    closeProcessReasonFinal,
    submitted,
    setSubmitted,
    closeCase,
    setCloseCase,
    setCancel,
    setCloseProcessDialogOpen,
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
      <Component
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={{
          submitted,
          setSubmitted,
          closeCase,
          setCloseCase,
          closeProcessReasonFinal,
        }}
      />

      {closeProcessReasonFinal && (
        <>
          <Box variant="warning">
            <StatusHeading
              variant="warning"
              title={
                isSameState(process.currentState, processClosed)
                  ? reviewDocuments.soleToJointClosed
                  : reviewDocuments.soleToJointWillBeClosed
              }
            />
            <Text style={{ marginLeft: 60 }}>
              <strong>Reason of close case:</strong> <br />
              {closeProcessReasonFinal}
            </Text>
          </Box>
          <CloseProcessView
            closeProcessReason={closeProcessReasonFinal}
            process={process}
            processConfig={processConfig}
            mutate={mutate}
          />
        </>
      )}
      {!closeProcessReasonFinal &&
        reviewDocumentsPageStates.includes(process.currentState.state) && (
          <>
            <Text size="md">{reviewDocuments.documentsNotSuitableCloseCase}</Text>
            <Button
              variant="secondary"
              onClick={() => {
                setCancel(false);
                setCloseProcessDialogOpen(true);
              }}
              style={{ width: 222 }}
            >
              {locale.closeCase}
            </Button>
          </>
        )}
    </>
  );
};
