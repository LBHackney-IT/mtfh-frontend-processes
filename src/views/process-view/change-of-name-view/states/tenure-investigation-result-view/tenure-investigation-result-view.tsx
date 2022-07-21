import React, { useState } from "react";

import { locale, processes } from "../../../../../services";
import { ProcessComponentProps } from "../../../../../types";
import { HoReviewView } from "../../../shared/ho-review-view/ho-review-view";
import { DesBox } from "../../../shared/process-components";
import { TenureInvestigationRecommendationBox } from "../../../sole-to-joint-view/states/shared";
import { tenureInvestigationResultStates } from "../../view-utils";

import { Center, Spinner, StatusErrorSummary } from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

const { views } = locale;

const processConfig = processes.changeofname;

export const TenureInvestigationResultView = ({
  process,
  mutate,
  optional,
}: ProcessComponentProps): JSX.Element => {
  const [globalError, setGlobalError] = useState<number>();
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const { person } = optional;
  return (
    <div data-testid="changeofname-tenure-investigation-result">
      {globalError && (
        <StatusErrorSummary
          id="tenure-investigation-result-global-error"
          code={globalError}
        />
      )}
      <DesBox
        title={views.submitCase.supportingDocumentsApproved}
        description={views.submitCase.viewDocumentsOnDes}
      />

      <TenureInvestigationRecommendationBox
        processConfig={processConfig}
        process={process}
      />

      {tenureInvestigationResultStates.includes(process.currentState.state) && (
        <HoReviewView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          optional={{ tenant: person }}
        />
      )}
    </div>
  );
};
