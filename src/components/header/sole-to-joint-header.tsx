import { locale } from "../../services";
import { IProcess } from "../../types";
import { EntitySummary } from "../entity-summary";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import { Center, ErrorSummary, Heading, Spinner } from "@mtfh/common/lib/components";

interface SoleToJointHeaderProps {
  processConfig: IProcess;
  process: Process;
}

export const SoleToJointHeader = ({
  processConfig,
  process,
}: SoleToJointHeaderProps): JSX.Element => {
  const { data: tenure, error } = useTenure(process.targetId);

  if (error) {
    return (
      <ErrorSummary
        id="sole-to-joint-header-view"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!tenure) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

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
