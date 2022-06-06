import { SoleToJointHeader } from "../../../../components";
import { locale } from "../../../../services";
import { CloseProcessView } from "../../shared/close-process-view";
import { TickBulletPoint } from "../check-eligibility-view/shared";

import { Box, Heading, List, StatusHeading, Text } from "@mtfh/common/lib/components";

const { views } = locale;
const { checkEligibility } = views;

export const ManualChecksFailedView = ({
  process,
  processConfig,
  mutate,
}): JSX.Element => {
  return (
    <div data-testid={`soletojoint-${process.currentState.state}`}>
      <SoleToJointHeader processConfig={processConfig} process={process} />
      <Text>{checkEligibility.autoCheckIntro}</Text>
      <Heading variant="h5">
        This is an automated check based on the data the system has. At this stage, the
        system does not have all the data required to make a decision, so these results
        are for guidance only and do not reflect accurate information.
      </Heading>
      <Box variant="success">
        <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
          {checkEligibility.passedChecks}
        </Heading>
        <TickBulletPoint text="Applicant is a named tenure holder on the tenure" />
        <TickBulletPoint text="Applicant is currently a sole tenant" />
        <TickBulletPoint text="Secure tenures can be changed from a sole to joint tenancy" />
        <TickBulletPoint text="Tenant's tenure is active" />
        <TickBulletPoint text="The proposed tenant is over 18 years of age" />
        <TickBulletPoint text="Proposed tenant is not a tenure holder or household member within the London Borough of Hackney" />
      </Box>
      <Box variant="warning">
        <StatusHeading variant="warning" title={checkEligibility.failedChecks} />{" "}
        <div style={{ marginLeft: "60px" }}>
          <Text size="sm">
            All criteria must be passed in order for the applicant to be eligible. <br />
            Applicant has failed one or more of the further eligibility questions:
          </Text>
          <Heading variant="h5">Failed further eligibility question:</Heading>
          <List variant="bullets">
            <Text size="sm">
              The tenant and proposed tenant have not been living together for 12 months
              or more, or are not married or in a civil partnership
            </Text>
            <Text size="sm">
              The tenant or proposed tenant intends to occupy another property as their
              only or main home
            </Text>
            <Text size="sm">Then tenant is a survivor of a joint tenancy</Text>
            <Text size="sm">
              The proposed tenant has been evicted by London Borough of Hackney or another
              local authority or housing association
            </Text>
            <Text size="sm">
              The proposed tenant is subject to immigration control under the Asylum And
              Immigration Act 1996
            </Text>
            <Text size="sm">The tenant has a live notice seeking possession</Text>
            <Text size="sm">The tenant has rent arrears over £500</Text>
          </List>
        </div>
      </Box>
      <CloseProcessView process={process} processConfig={processConfig} mutate={mutate} />
    </div>
  );
};
