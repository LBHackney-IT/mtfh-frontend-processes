import * as Yup from "yup";

import { appointmentSchema } from "../appointment";

export const requestDocumentsSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    requestType: Yup.string().required(errorMessages.W4),
  }).concat(appointmentSchema(errorMessages));

export type RequestDocumentsFormData = Yup.Asserts<
  ReturnType<typeof requestDocumentsSchema>
>;
