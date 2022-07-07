import { IProcess } from "../../types";
import { EntitySummary } from "../entity-summary";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { Heading } from "@mtfh/common/lib/components";

interface ChangeOfNameHeaderProps {
  processConfig: IProcess;
  process: Process;
}

export const ChangeOfNameHeader = ({
  processConfig,
  process,
}: ChangeOfNameHeaderProps): JSX.Element => {
  return (
    <>
      <Heading variant="h1">{processConfig.title}</Heading>
      <EntitySummary id={process.targetId} type={processConfig.targetType} />
    </>
  );
};
