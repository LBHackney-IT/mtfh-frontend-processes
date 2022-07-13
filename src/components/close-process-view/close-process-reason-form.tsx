import React from "react";

import * as Yup from "yup";

import { locale } from "../../services";

import { Field, TextArea } from "@mtfh/common/lib/components";

const { reasonForCancellation, reasonForCloseCase } = locale.views.closeProcess;

export const closeProcessSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    reasonForCancellation: Yup.string().required(errorMessages.W50),
  });

export type CloseProcessFormData = Yup.Asserts<ReturnType<typeof closeProcessSchema>>;

export const CloseProcessReasonForm = ({ isCancel }): JSX.Element => {
  return (
    <>
      <Field
        id="mtfh-close-case-form-reason"
        name="reasonForCancellation"
        label={isCancel ? reasonForCancellation : reasonForCloseCase}
        required
      >
        <TextArea rows={5} />
      </Field>
    </>
  );
};
