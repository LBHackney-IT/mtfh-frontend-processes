import { locale } from "../../services";

import {
  splitContactDetailsByType,
  useContactDetails,
} from "@mtfh/common/lib/api/contact-details/v2";
import { HouseholdMember } from "@mtfh/common/lib/api/tenure/v1/types";
import { Center, ErrorSummary, Spinner, Text } from "@mtfh/common/lib/components";

export const TenantContactDetails = ({ tenant }: { tenant: HouseholdMember }) => {
  const { data: contacts, error } = useContactDetails(tenant.id);

  if (error) {
    return (
      <ErrorSummary
        id="contact-details"
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
