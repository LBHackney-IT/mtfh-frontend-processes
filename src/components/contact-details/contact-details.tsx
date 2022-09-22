import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { ContactDetailsUpdateDialog } from "../../views/process-view/shared/contact-details-update-view";

import {
  splitContactDetailsByType,
  useContactDetails,
} from "@mtfh/common/lib/api/contact-details/v2";
import { Center, Link, Spinner, Text } from "@mtfh/common/lib/components";

export const ContactDetails = ({
  fullName,
  personId,
}: {
  fullName: string;
  personId: string;
}) => {
  const { data: contacts, error } = useContactDetails(personId);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

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

  const phoneNumber = phones?.[0]?.contactInformation.value;
  const email = emails?.[0]?.contactInformation.value;

  const allContactDetailsAvailable = email && phoneNumber;

  return (
    <>
      <Text>{fullName} contact details:</Text>
      <Text>
        Phone:
        <span style={{ marginLeft: "1em" }}>{phoneNumber}</span>
      </Text>
      <Text>
        Email:
        <span style={{ marginLeft: "1em" }}>{email}</span>
      </Text>
      {allContactDetailsAvailable ? (
        <Text>
          If the contact details are not up to date, please{" "}
          <Link
            as={RouterLink}
            to="#"
            variant="link"
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            update the contact details,{" "}
          </Link>
          it will automatically update the tenant’s contact details as well.
        </Text>
      ) : (
        <Text>
          Please{" "}
          <Link
            as={RouterLink}
            to="#"
            variant="link"
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            add the contact details,{" "}
          </Link>
          it will automatically update the tenant’s contact details as well.
        </Text>
      )}
      <ContactDetailsUpdateDialog
        personId={personId}
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
};
