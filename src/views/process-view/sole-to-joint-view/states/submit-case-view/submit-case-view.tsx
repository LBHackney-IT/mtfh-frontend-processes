import React, { useState } from "react";

import { SoleToJointHeader } from "../../../../../components";
import { locale } from "../../../../../services";
import { IProcess } from "../../../../../types";
import { ReviewApplicationView } from "../review-application-view/review-application-view";
import { DesBox, EligibilityChecksPassedBox } from "../shared";

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

  if (applicationSubmitted.state === process.currentState.state && !submitted) {
    return (
      <ReviewApplicationView
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={optional}
      />
    );
  }

  return (
    <>
      <SoleToJointHeader processConfig={processConfig} process={process} />
      {globalError && (
        <StatusErrorSummary id="review-documents-global-error" code={globalError} />
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
          <EligibilityChecksPassedBox />
          <DesBox
            title={views.submitCase.supportingDocumentsApproved}
            description={views.submitCase.viewDocumentsOnDes}
          />

          <Heading variant="h2">{submitCase.tenureInvestigation}</Heading>
          <Text>{submitCase.disclaimer}</Text>

          <Button
            onClick={async () => {
              try {
                await editProcess({
                  id: process.id,
                  processTrigger: states.documentChecksPassed.triggers.submitApplication,
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
