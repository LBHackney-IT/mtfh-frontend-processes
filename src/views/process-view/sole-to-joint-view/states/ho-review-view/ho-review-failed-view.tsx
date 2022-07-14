import { CloseProcessView } from "../../../../../components";
import { locale } from "../../../../../services";
import { IProcess } from "../../../../../types";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { StatusBox, Text } from "@mtfh/common/lib/components";

const { views } = locale;
interface HoReviewFailedViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
}

export const HoReviewFailedView = ({
  processConfig,
  process,
  mutate,
}: HoReviewFailedViewProps): JSX.Element => {
  const { states } = processConfig;
  const { hoApprovalFailed } = states;
  const { currentState, previousStates } = process;
  const hoApprovalFailedState =
    currentState.state === hoApprovalFailed.state
      ? currentState
      : previousStates.find((previous) => previous.state === hoApprovalFailed.state);

  return (
    <>
      <StatusBox variant="warning" title={views.hoReviewView.hoOutcome("declined")}>
        {hoApprovalFailedState?.processData.formData.reason && (
          <Text>{hoApprovalFailedState.processData.formData.reason}</Text>
        )}
      </StatusBox>

      <CloseProcessView
        process={process}
        processConfig={processConfig}
        mutate={mutate}
        optional={{ nextStepsDescription: false }}
      />
    </>
  );
};
