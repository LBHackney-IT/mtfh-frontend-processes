import { locale } from "../../../../../services";
import { AutomatedChecksPassedBox } from "../shared";

import { Box, Heading, List, StatusHeading, Text } from "@mtfh/common/lib/components";

const { views } = locale;
const { checkEligibility } = views;

export const ManualChecksFailedView = ({ process }): JSX.Element => {
  return (
    <div data-testid={`soletojoint-${process.currentState.state}`}>
      <Text>{checkEligibility.autoCheckIntro}</Text>
      <Heading variant="h4">{checkEligibility.autoCheckInfo}</Heading>
      <AutomatedChecksPassedBox />
      <Box variant="warning">
        <StatusHeading variant="warning" title={checkEligibility.failedChecks} />{" "}
        <div style={{ marginLeft: "60px" }}>
          <Text>
            All criteria must be passed in order for the applicant to be eligible. <br />
            Applicant has failed one or more of the further eligibility questions:
          </Text>
          <Heading variant="h4">Failed further eligibility question:</Heading>
          <List variant="bullets">
            <Text>
              The tenant and proposed tenant have not been living together for 12 months
              or more, or are not married or in a civil partnership
            </Text>
            <Text>
              The tenant or proposed tenant intends to occupy another property as their
              only or main home
            </Text>
            <Text>Then tenant is a survivor of a joint tenancy</Text>
            <Text>
              The proposed tenant has been evicted by London Borough of Hackney or another
              local authority or housing association
            </Text>
            <Text>
              The proposed tenant is subject to immigration control under the Asylum And
              Immigration Act 1996
            </Text>
            <Text>The tenant has a live notice seeking possession</Text>
            <Text>The tenant has rent arrears over £500</Text>
            <Text>Proposed joint tenant holds a tenancy or property elsewhere</Text>
          </List>
        </div>
      </Box>
    </div>
  );
};
