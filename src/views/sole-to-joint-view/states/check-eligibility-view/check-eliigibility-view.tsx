import { EntitySummary } from "../../../../components";
import { locale } from "../../../../services";
import { IProcess } from "../../../../types";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Box,
  Center,
  ErrorSummary,
  Heading,
  Spinner,
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

  const { currentState } = process;
  const { state } = currentState;

  return (
    <div data-testid="soletojoint-CheckEligibility">
      <Heading variant="h1">{processConfig.title}</Heading>
      <EntitySummary id={process.targetId} type={processConfig.targetType} />
      <Text>{checkEligibility.autoCheckIntro}</Text>
      {state === automatedChecksPassed.state && (
        <Box variant="success">
          <StatusHeading variant="success" title={checkEligibility.passedChecks} />
        </Box>
      )}
      {state === automatedChecksFailed.state && (
        <>
          <Box variant="warning">
            <StatusHeading variant="warning" title={checkEligibility.failedChecks} />
          </Box>
        </>
      )}
    </div>
  );
};
