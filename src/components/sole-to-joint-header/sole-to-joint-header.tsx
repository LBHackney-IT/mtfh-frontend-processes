import { IProcess } from "../../types";
import { EntitySummary } from "../entity-summary";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { Tenure } from "@mtfh/common/lib/api/tenure/v1/types";
import { Heading } from "@mtfh/common/lib/components";

interface SoleToJointHeaderProps {
  processConfig: IProcess;
  process: Process;
  tenure: Tenure;
}

export const SoleToJointHeader = ({
  processConfig,
  process,
  tenure,
}: SoleToJointHeaderProps): JSX.Element => {
  const automatedChecksPassedState = process.previousStates.find(
    (item) => item.state === processConfig.states.automatedChecksPassed.state,
  );

  const incomingTenantId =
    process.currentState?.processData?.formData?.incomingTenantId ||
    automatedChecksPassedState?.processData?.formData?.incomingTenantId;

  const incomingTenant = incomingTenantId
    ? tenure?.householdMembers.find((m) => m.id === incomingTenantId)
    : undefined;

  return (
    <>
      <Heading variant="h1">{processConfig.title}</Heading>
      <EntitySummary
        id={process.targetId}
        type={processConfig.targetType}
        config={{ incomingTenant }}
      />
    </>
  );
};
