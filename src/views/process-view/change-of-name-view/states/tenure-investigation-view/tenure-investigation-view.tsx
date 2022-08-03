import { ProcessComponentProps } from "../../../../../types";
import { SubmitCaseView } from "../../../shared/submit-case-view";
import { TenureInvestigationForm } from "../../../shared/tenure-investigation-form";

import { Center, Spinner } from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

export const TenureInvestigationView = ({
  processConfig,
  process,
  mutate,
  optional,
  setGlobalError,
}: ProcessComponentProps): JSX.Element => {
  const { submitted } = optional;
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (
    processConfig?.states.applicationSubmitted.state === process.currentState.state &&
    submitted
  ) {
    return (
      <SubmitCaseView
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={optional}
      />
    );
  }

  return (
    <div data-testid="changeofname-tenure-investigation">
      <TenureInvestigationForm
        process={process}
        mutate={mutate}
        setGlobalError={setGlobalError}
      />
    </div>
  );
};
