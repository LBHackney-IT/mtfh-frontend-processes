import React, { useState } from "react";

import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { IProcess } from "../../../../types";
import { EligibilityChecksPassedBox } from "../../sole-to-joint-view/states/shared";
import { DesBox } from "../process-components";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import { Button, Heading, StatusErrorSummary, Text } from "@mtfh/common/lib/components";

const { views } = locale;
const { submitCase } = views;

interface SubmitCaseViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  optional?: any;
}

export const SubmitCaseView = ({
  processConfig,
  process,
  mutate,
  optional,
}: SubmitCaseViewProps): JSX.Element => {
  const { submitted, setSubmitted } = optional;
  const [globalError, setGlobalError] = useState<number>();
  const { states } = processConfig;
  const { documentChecksPassed, applicationSubmitted } = states;

  return (
    <>
      {globalError && (
        <StatusErrorSummary id="submit-case-global-error" code={globalError} />
      )}

      {applicationSubmitted.state === process.currentState.state && submitted && (
        <>
          <Heading variant="h2">{submitCase.nextSteps}:</Heading>
          <Text>{submitCase.nextStepsText}</Text>

          <Button
            style={{ width: 180, marginRight: "100%" }}
            onClick={() => setSubmitted(false)}
          >
            Continue
          </Button>
        </>
      )}

      {documentChecksPassed.state === process.currentState.state && (
        <>
          {process.previousStates.find(
            (previous) => previous.state === "ManualChecksPassed",
          ) && <EligibilityChecksPassedBox />}
          {process.processName === "soletojoint" && (
            <DesBox
              title={views.submitCase.supportingDocumentsApproved}
              description={views.submitCase.viewDocumentsOnDes}
            />
          )}

          <Heading variant="h2">{submitCase.tenureInvestigation}</Heading>
          <Text>{submitCase.disclaimer}</Text>

          <Button
            onClick={async () => {
              try {
                await editProcess({
                  id: process.id,
                  processTrigger: Trigger.SubmitApplication,
                  processName: process?.processName,
                  etag: process.etag || "",
                  formData: {},
                  documents: [],
                });
                setSubmitted(true);
                mutate();
              } catch (e: any) {
                setGlobalError(e.response?.status || 500);
              }
            }}
          >
            {locale.submitCase}
          </Button>
        </>
      )}
    </>
  );
};
