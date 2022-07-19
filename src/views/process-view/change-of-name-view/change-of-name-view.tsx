import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { CloseProcessView, EntitySummary } from "../../../components";
import { locale, processes } from "../../../services";
import { ProcessSideBarProps } from "../../../types";
import { isSameState } from "../../../utils/processUtil";
import { SubmitCaseView } from "../shared/submit-case-view";
import { TenantNewNameView } from "./states";
import { RequestDocumentsView } from "./states/request-documents-view";
import { ReviewDocumentsView } from "./states/review-documents-view";
import { TenureInvestigationView } from "./states/tenure-investigation-view";
import { cancelButtonStates } from "./view-utils";

import { usePerson } from "@mtfh/common/lib/api/person/v1";
import { Process } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Center,
  ErrorSummary,
  Spinner,
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
  documentsRequestedDes,
  documentsRequestedAppointment,
  documentsAppointmentRescheduled,
  documentChecksPassed,
  applicationSubmitted,
  processClosed,
} = states;

const reviewDocumentsViewByStates = {
  [documentsRequestedDes.state]: ReviewDocumentsView,
  [documentsRequestedAppointment.state]: ReviewDocumentsView,
  [documentsAppointmentRescheduled.state]: ReviewDocumentsView,
};
const reviewDocumentsPageStates = Object.keys(reviewDocumentsViewByStates);

const components = {
  [enterNewName.state]: TenantNewNameView,
  [nameSubmitted.state]: RequestDocumentsView,
  ...reviewDocumentsViewByStates,
  [documentChecksPassed.state]: SubmitCaseView,
  [applicationSubmitted.state]: TenureInvestigationView,
};

const { views } = locale;
const { changeofname, reviewDocuments } = views;

const getActiveStep = (currentState, submitted: boolean) => {
  if (currentState === nameSubmitted.state) {
    return 1;
  }
  if ([...reviewDocumentsPageStates, processClosed.state].includes(currentState)) {
    return 2;
  }
  if (currentState === documentChecksPassed.state) {
    return 3;
  }
  if (currentState === applicationSubmitted.state && submitted) {
    return 4;
  }
  if (currentState === applicationSubmitted.state) {
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
    setCancel,
    setCloseProcessDialogOpen,
  } = optional;
  const { error, data: person } = usePerson(process.targetId);

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
      <Component
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={{
          person,
          submitted,
          setSubmitted,
          closeCase,
          setCloseCase,
          closeProcessReason,
        }}
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
