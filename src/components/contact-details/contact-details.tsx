import {
  splitContactDetailsByType,
  useContactDetails,
} from "@mtfh/common/lib/api/contact-details/v2";
import { Center, Spinner, Text } from "@mtfh/common/lib/components";

export const ContactDetails = ({
  fullName,
  personId,
}: {
  fullName: string;
  personId: string;
}) => {
  const { data: contacts, error } = useContactDetails(personId);

  if (error) {
    return <></>;
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
      <Text size="sm">{fullName} contact details:</Text>
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
