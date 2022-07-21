import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { CloseProcessView, EntitySummary } from "../../../components";
import { CloseCaseButton } from "../../../components/close-case-button/close-case-button";
import { locale, processes } from "../../../services";
import { ProcessSideBarProps } from "../../../types";
import { isPreviousState, isSameState } from "../../../utils/processUtil";
import { HoReviewView } from "../shared/ho-review-view/ho-review-view";
import { DesBox } from "../shared/process-components";
import { SubmitCaseView } from "../shared/submit-case-view";
import { TenureInvestigationRecommendationBox } from "../sole-to-joint-view/states/shared";
import { TenantNewNameView } from "./states";
import { RequestDocumentsView } from "./states/request-documents-view";
import { ReviewDocumentsView } from "./states/review-documents-view";
import { TenureInvestigationView } from "./states/tenure-investigation-view";
import {
  cancelButtonStates,
  reviewDocumentsStates,
  tenureInvestigationResultStates,
} from "./view-utils";

import { usePerson } from "@mtfh/common/lib/api/person/v1";
import { Process } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Center,
  ErrorSummary,
  Spinner,
  StatusErrorSummary,
  StatusHeading,
  Step,
  Stepper,
  Text,
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
  processClosed,
  tenureInvestigationPassed,
  tenureInvestigationFailed,
  tenureInvestigationPassedWithInt,
  interviewScheduled,
  interviewRescheduled,
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
};

const { views } = locale;
const { changeofname, reviewDocuments } = views;

const getActiveStep = (currentState, submitted: boolean) => {
  if (currentState === nameSubmitted.state) {
    return 1;
  }
  if ([...reviewDocumentsStates, processClosed.state].includes(currentState)) {
    return 2;
  }
  if (currentState === documentChecksPassed.state) {
    return 3;
  }
  if (currentState === applicationSubmitted.state && submitted) {
    return 4;
  }
  if (tenureInvestigationStates.includes(currentState)) {
    return 5;
  }

  return 0;
};

export const ChangeOfNameSideBar = (props: ProcessSideBarProps) => {
  const hasReassignCase = useFeatureToggle("MMH.ReassignCase");

  const {
    process: {
      id: processId,
      processName,
      currentState: { state },
    },
    setCloseProcessDialogOpen,
    setCancel,
    submitted = false,
  } = props;

  let activeStep = getActiveStep(state, submitted);
  let steps: JSX.Element[];
  if (activeStep > 4 || (!submitted && activeStep === 4)) {
    activeStep -= 5;
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

  const startIndex = 0;
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
  const {
    currentState: { state },
  } = process;

  return components[state];
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
  const {
    closeProcessReason,
    submitted,
    setSubmitted,
    closeCase,
    setCloseCase,
    setCloseProcessDialogOpen,
  } = optional;
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

      {states.documentChecksPassed.state === process.currentState.state ||
      isPreviousState(states.documentChecksPassed.state, process) ? (
        <DesBox
          title={views.submitCase.supportingDocumentsApproved}
          description={views.submitCase.viewDocumentsOnDes}
        />
      ) : (
        (states.documentsRequestedDes.state === process.currentState.state ||
          isPreviousState(states.documentsRequestedDes.state, process)) && (
          <DesBox title={reviewDocuments.documentsRequested} />
        )
      )}

      {(tenureInvestigationResultStates.includes(process.currentState.state) ||
        tenureInvestigationStates.find((state) => isPreviousState(state, process))) && (
        <TenureInvestigationRecommendationBox
          processConfig={processConfig}
          process={process}
        />
      )}

      <Component
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={{
          person,
          tenant: person,
          submitted,
          setSubmitted,
          closeCase,
          setCloseCase,
          closeProcessReason,
        }}
        setGlobalError={setGlobalError}
      />

      {closeProcessReason && (
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
              {closeProcessReason}
            </Text>
          </Box>
          <CloseProcessView
            closeProcessReason={closeProcessReason}
            process={process}
            processConfig={processConfig}
            mutate={mutate}
          />
        </>
      )}

      {!closeProcessReason &&
        reviewDocumentsStates.includes(process.currentState.state) && (
          <CloseCaseButton setCloseProcessDialogOpen={setCloseProcessDialogOpen} />
        )}
    </>
  );
};
