import { SoleToJointHeader } from "../../../../components";
import { locale } from "../../../../services";
import { CloseProcessView } from "../../shared/close-process-view";

import { Box, Heading, List, StatusHeading, Text } from "@mtfh/common/lib/components";

const { views } = locale;
const { checkEligibility } = views;

export const BreachChecksFailedView = ({
  process,
  processConfig,
  mutate,
}): JSX.Element => {
  return (
    <div data-testid="soletojoint-BreachChecksFailed">
      <SoleToJointHeader processConfig={processConfig} process={process} />
      <Text>{checkEligibility.autoCheckIntro}</Text>
      <Box variant="warning">
        <StatusHeading variant="warning" title={checkEligibility.failedChecks} />{" "}
        <div style={{ marginLeft: "60px" }}>
          <Text size="sm">
            All criteria must be passed in order for the applicant to be eligible. <br />
            Applicant has failed one or more breach of tenure checks.
          </Text>
          <Heading variant="h5">Failed breach of tenure check:</Heading>
          <List variant="bullets">
            <Text size="sm">
              The tenant has a live notice or notices against their tenure
            </Text>
            <Text size="sm">Tenant is a cautionary contact</Text>
            <Text size="sm">The tenant is a survivor of a joint tenancy</Text>
            <Text size="sm">
              Tenures that have previously been succeeded cannot be changed from a sole to
              a joint tenancy
            </Text>
            <Text size="sm">
              The tenant has rent arrears with Hackney or another local authority or
              housing association
            </Text>
          </List>
        </div>
      </Box>
      <CloseProcessView process={process} processConfig={processConfig} mutate={mutate} />
    </div>
  );
};
