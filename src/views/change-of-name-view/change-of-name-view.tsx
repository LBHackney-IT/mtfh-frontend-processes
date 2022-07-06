import React, { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { locale, processes } from "../../services";
import { CloseProcessDialog, CloseProcessView } from "../sole-to-joint-view";
import { TenantNewName } from "./states/tenant-new-name-view";

import { Process, useProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Center,
  ErrorSummary,
  Layout,
  Link,
  Spinner,
  StatusHeading,
  Step,
  Stepper,
  Text,
} from "@mtfh/common/lib/components";

import "./styles.scss";
import { CommentsView } from "../sole-to-joint-view/comments-view";

const processConfig = processes.changeofname;

const { states } = processConfig;
const { enterNewName, processClosed } = states;

const components = {
  [enterNewName.state]: TenantNewName,
};

const { views } = locale;
const { changeofname, reviewDocuments } = views;

const getActiveStep = (process: any, states, submitted: boolean, closeCase: boolean) => {
  return 0;
};

interface SideBarProps {
  process: any;
  states: any;
  submitted: boolean;
  closeCase: boolean;
  processId: string;
  processName: string;
  setCloseProcessDialogOpen: any;
  setCancel: any;
}

const SideBar = (props: SideBarProps) => {
  const {
    process,
    process: {
      currentState: { state },
    },
    states,
    submitted = false,
    closeCase = false,
    processId,
    processName,
    setCloseProcessDialogOpen,
    setCancel,
  } = props;

  const activeStep = getActiveStep(process, states, submitted, closeCase);
  const steps: JSX.Element[] = [
    <Step key="step-breach-of-tenancy">{changeofname.steps.tenantsNewName}</Step>,
    <Step key="step-request-documents">{changeofname.steps.requestDocuments}</Step>,
    <Step key="step-review-documents">{changeofname.steps.reviewDocuments}</Step>,
    <Step key="step-submit-case">{changeofname.steps.submitCase}</Step>,
    <Step key="step-finish">{changeofname.steps.finish}</Step>,
  ];
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
      <Button variant="secondary">{changeofname.actions.reassignCase}</Button>
      <Button
        variant="secondary"
        onClick={() => {
          setCancel(true);
          setCloseProcessDialogOpen(true);
        }}
      >
        {changeofname.actions.cancelProcess}
      </Button>
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

  return components[state];
};

export const ChangeOfNameView = () => {
  const [isCloseProcessDialogOpen, setCloseProcessDialogOpen] = useState<boolean>(false);
  const [closeProcessReason, setCloseProcessReason] = useState<string>();
  const [isCancel, setCancel] = useState<boolean>(false);
  const { processId } = useParams<{ processId: string }>();

  // const {
  //   data: process,
  //   error,
  //   mutate,
  // } = useProcess({
  //   id: processId,
  //   processName: processConfig.processName,
  // });

  // todo: delete the blow mock process and use the above one after process BE is ready
  const {
    data: process,
    error,
    mutate,
  } = {
    data: {
      id: "02373a9d-d0da-4cd0-8633-c0335397e7cf",
      targetId: "507ce048-6100-ea42-7219-308f061133fc",
      targetType: "person",
      relatedEntities: null,
      processName: "changeofname",
      currentState: {
        state: "EnterNewName",
        permittedTriggers: ["CheckAutomatedEligibility"],
        assignment: { type: null, value: null, patch: "tenants" },
        processData: { formData: null, documents: null },
        createdAt: "2022-07-05T18:14:35.4480935Z",
        updatedAt: "2022-07-05T18:14:35.4480936Z",
      },
      previousStates: [],
    } as unknown as Process,
    error: undefined,
    mutate: () => undefined,
  };

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [closeCase, setCloseCase] = useState<boolean>(false);

  if (error) {
    return (
      <ErrorSummary
        id="change-of-name-view"
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
        id="change-of-name-view"
        title={locale.errors.unableToFindState}
        description={locale.errors.unableToFindStateDescription}
      />
    );
  }

  const {
    currentState,
    currentState: { state },
  } = process;

  let closeProcessReasonFinal = closeProcessReason;
  if (!closeProcessReasonFinal && isSameState(currentState, processClosed)) {
    closeProcessReasonFinal = process.currentState.processData.formData.Reason;
  }

  return (
    <Layout
      data-testid="changeofname"
      sidePosition="right"
      backLink={
        <Link
          as={RouterLink}
          to={`/processes/changeofname/start/person/${process.targetId}`}
          variant="back-link"
        >
          {locale.backButton}
        </Link>
      }
      side={
        <SideBar
          process={process}
          states={states}
          submitted={submitted}
          closeCase={closeCase}
          processId={processId}
          processName={processConfig.processName}
          setCloseProcessDialogOpen={setCloseProcessDialogOpen}
          setCancel={setCancel}
        />
      }
    >
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

      <CloseProcessDialog
        isCloseProcessDialogOpen={isCloseProcessDialogOpen}
        setCloseProcessDialogOpen={setCloseProcessDialogOpen}
        setCloseProcessReason={setCloseProcessReason}
        mutate={mutate}
        isCancel={isCancel}
      />

      {closeProcessReasonFinal && (
        <>
          <Box variant="warning">
            <StatusHeading
              variant="warning"
              title={
                isSameState(currentState, processClosed)
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
      {!closeProcessReasonFinal && (
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

      <hr className="divider" />

      <CommentsView targetType="process" targetId={processId} mutate={mutate} />
    </Layout>
  );
};
