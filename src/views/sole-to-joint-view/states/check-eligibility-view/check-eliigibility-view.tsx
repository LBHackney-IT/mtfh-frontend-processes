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
  List,
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
          <Heading variant="h5">
            This is an automated check based on the data the system has. At this stage,
            the system does not have all the data required to make a decision, so these
            results are for guidance only and do not reflect accurate information.
          </Heading>
          <Box variant="warning">
            <StatusHeading variant="warning" title={checkEligibility.failedChecks} />
            <div style={{ marginLeft: "60px" }}>
              <Text size="sm">
                All criteria must be passed in order for the applicant to be eligible.{" "}
                <br />
                Applicant has failed one or more of the checks listed below.
              </Text>
              <Heading variant="h5">Failed criteria</Heading>
              <List variant="bullets">
                <Text size="sm">
                  Applicant is not a named tenure holder on the tenure
                </Text>
                <Text size="sm">Applicant is already a joint tenant</Text>
                <Text size="sm">
                  Only secure tenures can be changed from a sole to a joint tenancy
                </Text>
                <Text size="sm">
                  Inactive or pending tenures cannot be changed to a joint tenancy
                </Text>
                <Text size="sm">Applicant has a live notice of seeking possession</Text>
                <Text size="sm">Proposed tenants must be over 18 years of age</Text>
                <Text size="sm">
                  Proposed tenant is not a tenure holder or household member within the
                  London Borough of Hackney
                </Text>
              </List>
            </div>
          </Box>
        </>
      )}
    </div>
  );
};
