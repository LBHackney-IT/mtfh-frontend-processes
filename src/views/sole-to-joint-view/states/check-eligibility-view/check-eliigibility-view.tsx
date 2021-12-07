import { useState } from "react";

import { EntitySummary } from "../../../../components";
import { locale } from "../../../../services";
import { IProcess } from "../../../../types";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Box,
  Button,
  Center,
  ErrorSummary,
  Heading,
  Spinner,
  StatusErrorSummary,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";

interface CheckEligibilityViewProps {
  processConfig: IProcess;
  process: Process;
}

const { views } = locale;
const { checkEligibility } = views;

export const CheckEligibilityView = ({
  processConfig,
  process,
}: CheckEligibilityViewProps) => {
  const [globalError, setGlobalError] = useState<number>();
  const { automatedChecksFailed, automatedChecksPassed } = processConfig.states;
  const { data: tenure, error } = useTenure(process.targetId);

  if (error) {
    return (
      <ErrorSummary
        id="select-tenants-view"
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

  const cancelProcess = async () => {
    try {
      await editProcess({
        ...process,
        processTrigger: automatedChecksFailed.trigger,
      });
    } catch (e: any) {
      setGlobalError(e.response?.status || 500);
    }
  };

  const { currentState } = process;
  const { stateName } = currentState;

  return (
    <div data-testid="soletojoint-CheckEligibility">
      <Heading variant="h1">{processConfig.title}</Heading>
      <EntitySummary id={process.targetId} type={processConfig.targetType} />
      {globalError && (
        <StatusErrorSummary id="select-tenant-global-error" code={globalError} />
      )}
      <Text>{checkEligibility.autoCheckIntro}</Text>
      {stateName === automatedChecksPassed.stateName && (
        <Box variant="success">
          <StatusHeading variant="success" title={checkEligibility.passedChecks} />
        </Box>
      )}
      {stateName === automatedChecksFailed.stateName && (
        <>
          <Box variant="warning">
            <StatusHeading variant="warning" title={checkEligibility.failedChecks} />
          </Box>
          <Button onClick={cancelProcess}>{locale.cancelProcess}</Button>
        </>
      )}
    </div>
  );
};
