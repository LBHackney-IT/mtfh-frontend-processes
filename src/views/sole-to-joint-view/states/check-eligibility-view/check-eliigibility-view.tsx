import { IProcess } from "../../../../types";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { Heading, Layout } from "@mtfh/common/lib/components";

interface CheckEligibilityViewProps {
  processConfig: IProcess;
  process: Process;
}

export const CheckEligibilityView = ({
  processConfig,
  process,
}: CheckEligibilityViewProps) => {
  const SideBar = () => null;

  return (
    <Layout
      data-testid="soletojoint-CheckEligibility"
      sidePosition="right"
      side={<SideBar />}
    >
      <Heading variant="h1">{processConfig.title}</Heading>
      <p>{processConfig.processName}</p>
      <p>{process.currentState.stateName}</p>
    </Layout>
  );
};
