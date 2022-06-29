import React from "react";

import { Form, Formik } from "formik";

import { CloseProcessReasonForm } from "./close-process-reason-form";

import { Button, Dialog, DialogActions } from "@mtfh/common/lib/components";

export const CloseProcessDialog = ({
  isCloseProcessDialogOpen,
  setCloseProcessDialogOpen,
  setCloseProcessReason,
  mutate,
  isCancel,
}) => {
  return (
    <Dialog
      isOpen={isCloseProcessDialogOpen}
      onDismiss={() => setCloseProcessDialogOpen(false)}
      title={`Are you sure you want to ${
        isCancel ? "cancel" : "close"
      } this process? You will have to begin the process from the start.`}
    >
      <Formik
        initialValues={{ reasonForCancellation: undefined }}
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
