import React from "react";

import {
  Button,
  Center,
  Dialog,
  PageAnnouncementProvider,
  Spinner,
  Text,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";
import { ContactDetailsView } from "@mtfh/personal-details";
import "./styles.scss";

export const ContactDetailsUpdateDialog = ({ isDialogOpen, setDialogOpen, personId }) => {
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const close = () => setDialogOpen(false);

  return (
    <Dialog
      isOpen={isDialogOpen}
      onDismiss={close}
      title="Update contact details"
      className="lbh-dialog-contact-details"
    >
      <Text size="sm">
        The details will be instantly updated within MMH when you save the email
        address/phone number.
      </Text>
      <Text size="sm">
        Only the first phone and email address will be displayed with the MMH application
        e.g. for appointment bookings.
      </Text>
      <Text size="sm">
        You can 'Return to your application' once you have completed the updates. The new
        contact details will be displayed.
      </Text>
      <PageAnnouncementProvider sessionKey="editPerson">
        <ContactDetailsView
          providedPersonId={personId}
          onComplete={(_, hasUpdatedContactDetails: boolean) => {
            if (hasUpdatedContactDetails) {
              sessionStorage.setItem("person:heading", "Person Updated");
            }
          }}
          hideAddress
          isInADialog
        />
      </PageAnnouncementProvider>
      <Button
        data-testid="close-update-contact-details-modal"
        variant="primary"
        onClick={close}
      >
        Return to application
      </Button>
    </Dialog>
  );
};
