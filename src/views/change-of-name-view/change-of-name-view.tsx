import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale, processes } from "../../services";
import { ProcessSideBarProps } from "../../types";
import { TenantNewName } from "./states/tenant-new-name-view";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { Button, ErrorSummary, Step, Stepper } from "@mtfh/common/lib/components";

import "./styles.scss";

const processConfig = processes.changeofname;

const { states } = processConfig;
const { enterNewName } = states;

const components = {
  [enterNewName.state]: TenantNewName,
};

const { views } = locale;
const { changeofname } = views;

const getActiveStep = () => {
  return 0;
};

export const ChangeOfNameSideBar = (props: ProcessSideBarProps) => {
  const {
    process: { processId, processName },
    setCloseProcessDialogOpen,
    setCancel,
  } = props;

  const activeStep = getActiveStep();
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
  const { closeProcessReasonFinal, submitted, setSubmitted, closeCase, setCloseCase } =
    optional;
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

  return (
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
  );
};
