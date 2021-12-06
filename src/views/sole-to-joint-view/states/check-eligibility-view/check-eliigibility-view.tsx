import { IProcess } from "../../../../types";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { Heading } from "@mtfh/common/lib/components";

interface CheckEligibilityViewProps {
  processConfig: IProcess;
  process: Process;
}

export const CheckEligibilityView = ({
  processConfig,
  process,
}: CheckEligibilityViewProps) => {
  return (
    <div data-testid="soletojoint-CheckEligibility">
      <Heading variant="h1">{processConfig.title}</Heading>
      <p>{processConfig.processName}</p>
      <p>{process.currentState.stateName}</p>
    </div>
  );
};
