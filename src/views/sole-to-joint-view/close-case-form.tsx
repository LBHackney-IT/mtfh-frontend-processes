import React from "react";

import * as Yup from "yup";

import { locale } from "../../services";

import { Field, TextArea } from "@mtfh/common/lib/components";

const { reasonForCancellation, reasonForCloseCase } = locale.views.closeCase;

export const closeCaseSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    reasonForCancellation: Yup.string().required(errorMessages.W50),
  });

export type CloseCaseFormData = Yup.Asserts<ReturnType<typeof closeCaseSchema>>;

export const CloseCaseForm = ({ isCancel }): JSX.Element => {
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
