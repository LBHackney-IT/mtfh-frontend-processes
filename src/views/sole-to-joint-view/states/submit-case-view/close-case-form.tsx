import React from "react";

import * as Yup from "yup";

import { locale } from "../../../../services";

import { Field, TextArea } from "@mtfh/common/lib/components";

const { reasonForRejection } = locale.views.closeCase;

export const closeCaseSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    reasonForRejection: Yup.string().required(errorMessages.W50),
  });

export type CloseCaseFormData = Yup.Asserts<ReturnType<typeof closeCaseSchema>>;

export const CloseCaseForm = (): JSX.Element => {
  return (
    <>
      <Field
        id="mtfh-close-case-form-reason"
        name="reasonForRejection"
        label={reasonForRejection}
        required
      >
        <TextArea rows={5} />
      </Field>
    </>
  );
};
