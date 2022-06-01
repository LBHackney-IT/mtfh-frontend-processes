import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { SoleToJointHeader } from "../../../../components";
import { locale } from "../../../../services";
import { IProcess } from "../../../../types";
import { EligibilityChecksPassedBox } from "../check-eligibility-view/shared";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Heading,
  Link,
  StatusErrorSummary,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";

const { views } = locale;
const { submitCase } = views;

interface SubmitCaseViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
}

export const SubmitCaseView = ({
  processConfig,
  process,
  mutate,
}: SubmitCaseViewProps): JSX.Element => {
  const [globalError, setGlobalError] = useState<number>();
  const { states } = processConfig;
  const { documentChecksPassed, applicationSubmitted } = states;

  return (
    <>
      <SoleToJointHeader processConfig={processConfig} process={process} />
      {globalError && (
        <StatusErrorSummary id="review-documents-global-error" code={globalError} />
      )}

      {applicationSubmitted.state === process.currentState.state && (
        <>
          <Heading variant="h2">{submitCase.nextSteps}:</Heading>
          <Text>{submitCase.nextStepsText}</Text>

          <div style={{ marginTop: 24 }}>
            <Link as={RouterLink} to="" variant="back-link">
              {locale.returnHomePage}
            </Link>
          </div>
        </>
      )}

      {documentChecksPassed.state === process.currentState.state && (
        <>
          <EligibilityChecksPassedBox />
          <Box variant="success">
            <StatusHeading
              variant="success"
              title={submitCase.supportingDocumentsApproved}
            />
            <div
              style={{ marginLeft: 60, marginTop: 17.5 }}
              className="govuk-link lbh-link lbh-link--no-visited-state"
            >
              <Link as={RouterLink} to="#" variant="link">
                {views.reviewDocuments.viewInDes}
              </Link>
            </div>
          </Box>

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
