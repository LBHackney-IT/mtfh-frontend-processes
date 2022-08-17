import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { CloseProcessView, EntitySummary } from "../../../components";
import { CloseCaseButton } from "../../../components/close-case-button/close-case-button";
import { locale, processes } from "../../../services";
import { ProcessSideBarProps } from "../../../types";
import { getPreviousState } from "../../../utils/processUtil";
import { HoReviewView } from "../shared/ho-review-view/ho-review-view";
import { SubmitCaseView } from "../shared/submit-case-view";
import { TenantNewNameView } from "./states";
import { NewTenancyView } from "./states/new-tenancy-view/new-tenancy-view";
import { RequestDocumentsView } from "./states/request-documents-view";
import { ReviewDocumentsView } from "./states/review-documents-view";
import { TenureInvestigationView } from "./states/tenure-investigation-view";
import { StatusBoxes } from "./status-boxes";
import { cancelButtonStates, reviewDocumentsStates } from "./view-utils";

import { usePerson } from "@mtfh/common/lib/api/person/v1";
import { Process } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  ErrorSummary,
  Spinner,
  StatusErrorSummary,
  Step,
  Stepper,
} from "@mtfh/common/lib/components";
import { useFeatureToggle } from "@mtfh/common/lib/hooks";

import "./styles.scss";

const processConfig = processes.changeofname;

const { states } = processConfig;
const {
  enterNewName,
  nameSubmitted,
  documentChecksPassed,
  applicationSubmitted,
  tenureInvestigationPassed,
  tenureInvestigationFailed,
  tenureInvestigationPassedWithInt,
  interviewScheduled,
  interviewRescheduled,
  hoApprovalPassed,
  hoApprovalFailed,
  tenureAppointmentScheduled,
  tenureAppointmentRescheduled,
  nameUpdated,
  processClosed,
  processCancelled,
} = states;

const reviewDocumentsViewByStates = {};
reviewDocumentsStates.forEach((state) => {
  reviewDocumentsViewByStates[state] = ReviewDocumentsView;
});

const tenureInvestigationViewByStates = {
  [applicationSubmitted.state]: TenureInvestigationView,
  [tenureInvestigationPassed.state]: HoReviewView,
  [tenureInvestigationFailed.state]: HoReviewView,
  [tenureInvestigationPassedWithInt.state]: HoReviewView,
  [interviewScheduled.state]: HoReviewView,
  [interviewRescheduled.state]: HoReviewView,
};
const tenureInvestigationStates = Object.keys(tenureInvestigationViewByStates);

const components = {
  [enterNewName.state]: TenantNewNameView,
  [nameSubmitted.state]: RequestDocumentsView,
  ...reviewDocumentsViewByStates,
  [documentChecksPassed.state]: SubmitCaseView,
  ...tenureInvestigationViewByStates,
  [hoApprovalPassed.state]: NewTenancyView,
  [hoApprovalFailed.state]: () => <></>,
  [tenureAppointmentScheduled.state]: NewTenancyView,
  [tenureAppointmentRescheduled.state]: NewTenancyView,
  [nameUpdated.state]: NewTenancyView,
};

const { views } = locale;
const { changeofname } = views;

const getActiveStep = (process: Process, submitted: boolean) => {
  const { currentState } = process;

  const processState = [processCancelled.state, processClosed.state].includes(
    currentState.state,
  )
    ? getPreviousState(process)
    : currentState;

  if (processState.state === nameSubmitted.state) {
    return 1;
  }
  if ([...reviewDocumentsStates, processClosed.state].includes(processState.state)) {
    return 2;
  }
  if (processState.state === documentChecksPassed.state) {
    return 3;
  }
  if (processState.state === applicationSubmitted.state && submitted) {
    return 4;
  }
  if (
    [
      ...tenureInvestigationStates,
      applicationSubmitted.state,
      hoApprovalPassed.state,
      tenureAppointmentScheduled.state,
      tenureAppointmentRescheduled.state,
    ].includes(processState.state)
  ) {
    return 5;
  }
  if ([hoApprovalFailed.state, nameUpdated.state].includes(processState.state)) {
    return 6;
  }

  return 0;
};

export const ChangeOfNameSideBar = (props: ProcessSideBarProps) => {
  const hasReassignCase = useFeatureToggle("MMH.ReassignCase");

  const {
    process,
    process: {
      id: processId,
      processName,
      currentState: { state },
    },
    setCloseProcessDialogOpen,
    setCancel,
    submitted = false,
  } = props;

  let activeStep = getActiveStep(process, submitted);
  let startIndex = 0;

  let steps: JSX.Element[];
  if (activeStep > 4 || (!submitted && activeStep === 4)) {
    activeStep -= 5;
    startIndex = 10;
    steps = [
      <Step key="step-review-application">{changeofname.steps.reviewApplication}</Step>,
      <Step key="step-end-case">{changeofname.steps.endCase}</Step>,
    ];
  } else {
    steps = [
      <Step key="step-tenants-new-name">{changeofname.steps.tenantsNewName}</Step>,
      <Step key="step-request-documents">{changeofname.steps.requestDocuments}</Step>,
      <Step key="step-review-documents">{changeofname.steps.reviewDocuments}</Step>,
      <Step key="step-submit-case">{changeofname.steps.submitCase}</Step>,
      <Step key="step-finish">{changeofname.steps.finish}</Step>,
    ];
  }

  return (
    <>
      <Stepper
        data-testid="mtfh-stepper-change-of-name"
        activeStep={activeStep}
        startIndex={startIndex}
      >
        {steps}
      </Stepper>
      {hasReassignCase && (
        <Button variant="secondary">{changeofname.actions.reassignCase}</Button>
      )}
      {cancelButtonStates.includes(state) && (
        <Button
          variant="secondary"
          onClick={() => {
            setCancel(true);
            setCloseProcessDialogOpen(true);
          }}
        >
          {changeofname.actions.cancelProcess}
        </Button>
      )}
      <Button
        variant="secondary"
        as={RouterLink}
        to={`/activities/process/${processName}/${processId}`}
      >
        {changeofname.actions.caseActivityHistory}
      </Button>
    </>
  );
};

const getComponent = (process) => {
  const { currentState } = process;

  const processState = [processCancelled.state, processClosed.state].includes(
    currentState.state,
  )
    ? getPreviousState(process)
    : currentState;

  return components[processState.state];
};

export const ChangeOfNameView = ({
  process,
  mutate,
  optional,
}: {
  process: Process;
  mutate: any;
  optional: any;
}): JSX.Element => {
  const { closeProcessReason, setCloseProcessDialogOpen, isCancel } = optional;
  const { error, data: person } = usePerson(process.targetId);
  const [globalError, setGlobalError] = useState<number>();

  if (error) {
    return (
      <ErrorSummary
        id="entity-summary"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!person) {
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
        id="change-of-name-view"
        data-testid="error-change-of-name-view"
        title={locale.errors.unableToFindState}
        description={locale.errors.unableToFindStateDescription}
      />
    );
  }

  return (
    <>
      <EntitySummary id={process.targetId} type={processConfig.targetType} />

      {globalError && (
        <StatusErrorSummary id="tenure-investigation-global-error" code={globalError} />
      )}

      <StatusBoxes process={process} processConfig={processConfig} person={person} />

      <Component
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={{
          ...optional,
          person,
          tenant: person,
          closeProcessReason,
        }}
        setGlobalError={setGlobalError}
      />

      {(closeProcessReason ||
        [hoApprovalFailed.state, processClosed.state, processCancelled.state].includes(
          process.currentState.state,
        )) && (
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
