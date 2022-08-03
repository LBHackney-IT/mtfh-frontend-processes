import React from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { CloseProcessReasonForm } from "./close-process-reason-form";

import {
  Button,
  Center,
  Dialog,
  DialogActions,
  Spinner,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

export const closeProcessDialogSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    reasonForCancellation: Yup.string().required(errorMessages.W6),
  });

export type CloseProcessDialogFormData = Yup.Asserts<
  ReturnType<typeof closeProcessDialogSchema>
>;

export const CloseProcessDialog = ({
  isCloseProcessDialogOpen,
  setCloseProcessDialogOpen,
  setCloseProcessReason,
  mutate,
  isCancel,
}) => {
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Dialog
      isOpen={isCloseProcessDialogOpen}
      onDismiss={() => setCloseProcessDialogOpen(false)}
      title={`Are you sure you want to ${
        isCancel ? "cancel" : "close"
      } this process? You will have to begin the process from the start.`}
    >
      <Formik<CloseProcessDialogFormData>
        initialValues={{ reasonForCancellation: "" }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={closeProcessDialogSchema(errorMessages)}
        onSubmit={async (values) => {
          const { reasonForCancellation } = values;
          setCloseProcessReason(reasonForCancellation);
          mutate();
          setCloseProcessDialogOpen(false);
        }}
      >
        <Form noValidate id="cancel-process-form" className="cancel-process-form">
          <CloseProcessReasonForm isCancel={isCancel} />
          <DialogActions>
            <Button type="submit" data-testid="close-process-modal-submit">
              {isCancel ? "Cancel Process" : "Close case"}
            </Button>
            <Button variant="secondary" onClick={() => setCloseProcessDialogOpen(false)}>
              Back
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
