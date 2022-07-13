import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../../../services";
import { TickBulletPoint } from "../../process-components";

import { Box, Heading, Link, StatusHeading } from "@mtfh/common/lib/components";

const { views } = locale;
const { breachOfTenancy, checkEligibility } = views;

export const EligibilityChecksPassedBox = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Box variant="success">
      <StatusHeading variant="success" title={breachOfTenancy.passedChecks} />

      {!expanded && (
        <div
          style={{ paddingLeft: 60, marginTop: 17.5 }}
          className="govuk-link lbh-link lbh-link--no-visited-state"
        >
          <Link as={RouterLink} to="#" variant="link" onClick={() => setExpanded(true)}>
            Show all eligibility checks
          </Link>
        </div>
      )}
      {expanded && (
        <>
          <Heading variant="h4">Passed automatic eligibility checks</Heading>
          <div style={{ paddingLeft: "25px" }}>
            <TickBulletPoint text="Applicant is a named tenure holder on the tenure" />
            <TickBulletPoint text="Applicant is currently a sole tenant" />
            <TickBulletPoint text="Secure tenures can be changed from a sole to a joint tenancy" />
            <TickBulletPoint text="Tenant’s tenure is active" />
            <TickBulletPoint text="Applicant does not have rent arrears" />
            <TickBulletPoint text="The tenant does not have a live notice seeking possession" />
            <TickBulletPoint text="The proposed tenant is over 18 years of age" />
            <TickBulletPoint text="Proposed tenant is not a tenure holder or household member within the London Borough of Hackney" />
          </div>
          <Heading variant="h4">Passed eligiblity questions</Heading>
          <div style={{ paddingLeft: "25px" }}>
            <TickBulletPoint text="The tenant and proposed tenant have been living together for 12 months or more, or are married or in a civil partnership" />
            <TickBulletPoint text="Neither the tenant or the proposed tenant intends to occupy any other property besides this one as their only or main home" />
            <TickBulletPoint text="The tenant is not a survivor of a joint tenancy" />
            <TickBulletPoint text="The proposed tenant has not been evicted by London Borough of Hackney or any other local authority or housing association" />
            <TickBulletPoint text="The proposed tenant is not subject to immigration control under the Asylum And Immigration Act 1996" />
          </div>
          <Heading variant="h4">Passed breach of tenure checks</Heading>
          <div style={{ paddingLeft: "25px" }}>
            <TickBulletPoint text="Excluding NOSP, the tenant does not have any live notices against their tenure" />
            <TickBulletPoint text="Tenant is a cautionary contact" />
            <TickBulletPoint text="The tenure has not previously been succeeded" />
          </div>
          <div
            style={{ paddingLeft: "25px" }}
            className="govuk-link lbh-link lbh-link--no-visited-state"
          >
            <Link
              as={RouterLink}
              to="#"
              variant="link"
              onClick={() => setExpanded(false)}
            >
              Hide all eligibility checks
            </Link>
          </div>
        </>
      )}
    </Box>
  );
};

export const AutomatedChecksPassedBox = (): JSX.Element => {
  return (
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
  );
};
