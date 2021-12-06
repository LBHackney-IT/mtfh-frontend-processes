import { useParams } from "react-router-dom";

import { locale, processes } from "../../services";
import { CheckEligibilityView, SelectTenantsView } from "./states";

import { useProcess } from "@mtfh/common/lib/api/process/v1";
import { Center, ErrorSummary, Spinner } from "@mtfh/common/lib/components";

export const SoleToJointView = () => {
  const { processId } = useParams<{ processId: string }>();

  const processConfig = processes.soletojoint;

  const { data: process, error } = useProcess({
    id: processId,
    processName: processConfig.processName,
  });

  if (error) {
    return (
      <ErrorSummary
        id="sole-to-joint-view"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!process) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const { currentState } = process;
  const { stateName } = currentState;

  const { states } = processConfig;
  const { selectTenants, checkEligibility } = states;

  if (stateName === selectTenants.stateName) {
    return <SelectTenantsView processConfig={processConfig} process={process} />;
  }

  if (stateName === checkEligibility.stateName) {
    return <CheckEligibilityView processConfig={processConfig} process={process} />;
  }

  return null;
};
