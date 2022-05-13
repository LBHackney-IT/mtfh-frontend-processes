import { useState } from "react";

import { BulletWithExplanation } from "./shared";

import {
  splitContactDetailsByType,
  useContactDetails,
} from "@mtfh/common/lib/api/contact-details/v2";
import { HouseholdMember } from "@mtfh/common/lib/api/tenure/v1/types";
import { Button, Checkbox, Heading, List, Text } from "@mtfh/common/lib/components";

export interface RequestDcoumentsViewProps {
  tenant: HouseholdMember;
}

export const RequestDcoumentsView = (props: RequestDcoumentsViewProps) => {
  const { tenant } = props;
  const { data: contacts } = useContactDetails(tenant.id);
  const { emails, phones } = splitContactDetailsByType(contacts?.results || []);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  return (
    <>
      <Heading variant="h3">Suporting documents</Heading>
      <Text size="sm">
        The following documentation is required from the secure tenant and/or proposed
        tenant, as proof to support their application:
      </Text>
      <List variant="bullets">
        <BulletWithExplanation
          text="Secure and Proposed tenant: Two forms of proof of identity for both the
              secure and proposed tenant. At least one each must be photographic ID"
          explanation="for example: valid passport, driving licence, bank statement, utility bill"
        />
        <BulletWithExplanation
          text="Proposed tenant: Proof of immigration status"
          explanation="for example: passport, home office letter, embassy letter, immigration status document"
        />
        <BulletWithExplanation
          text="Proposed tenant: Proof of relationship to the exisiting tenant"
          explanation="for example: marriage or civil partner certificate"
        />
        <BulletWithExplanation
          text="Proposed tenant: Proof of co-habitation: three documents proving 12 months
                residency at the property. If marriage certificate provided, any Proof of
                Address can be accepted."
          explanation="for example: letter, utility bill, council tax bill"
        />
      </List>
      <Heading variant="h3">Checking suporting documents</Heading>
      <Text size="sm">
        You must make an appointment with the tenant to check supporting documents
        in-person.
      </Text>
      <Text size="sm">{tenant.fullName} contact details:</Text>
      <Text size="sm">
        Phone:
        <span style={{ marginLeft: "1em" }}>{phones?.[0]?.contactInformation.value}</span>
      </Text>
      <Text size="sm">
        Email:
        <span style={{ marginLeft: "1em" }}>{emails?.[0]?.contactInformation.value}</span>
      </Text>
      <Checkbox id="condition" onChange={() => setConfirmed(!confirmed)}>
        I have made an appointment to check supporting documents
      </Checkbox>
      <Button type="submit" disabled={!confirmed}>
        Next
      </Button>
    </>
  );
};
