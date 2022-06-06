import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../../services";

import {
  splitContactDetailsByType,
  useContactDetails,
} from "@mtfh/common/lib/api/contact-details/v2";
import { HouseholdMember } from "@mtfh/common/lib/api/tenure/v1/types";
import {
  Box,
  Center,
  ErrorSummary,
  Heading,
  Link,
  Spinner,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";

const { views } = locale;
const { breachOfTenancy } = views;

export const TickIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35 15.5127L18.775 33L11 24.6201L14.2591 21.1074L18.775 25.9746L31.7409 12L35 15.5127Z"
        fill="#00664F"
      />
    </svg>
  );
};

export const TickBulletPoint = ({ text }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "0 0 0 -7px" }}>
      <TickIcon />
      <Text size="sm" style={{ margin: 0 }}>
        {text}
      </Text>
    </div>
  );
};

export const BulletWithExplanation = ({ text, explanation }) => {
  return (
    <>
      <Text size="sm" style={{ fontWeight: "bold" }}>
        {text}
      </Text>
      <span className="lbh-body-s">({explanation})</span>
    </>
  );
};

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

export const TenantContactDetails = ({ tenant }: { tenant: HouseholdMember }) => {
  const { data: contacts, error } = useContactDetails(tenant.id);

  if (error) {
    return (
      <ErrorSummary
        id="request-documents-view-contact-details"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!contacts) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const { emails, phones } = splitContactDetailsByType(contacts?.results || []);

  return (
    <>
      <Text size="sm">{tenant.fullName} contact details:</Text>
      <Text size="sm">
        Phone:
        <span style={{ marginLeft: "1em" }}>{phones?.[0]?.contactInformation.value}</span>
      </Text>
      <Text size="sm">
        Email:
        <span style={{ marginLeft: "1em" }}>{emails?.[0]?.contactInformation.value}</span>
      </Text>
    </>
  );
};
