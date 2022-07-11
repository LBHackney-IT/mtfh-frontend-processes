import * as Yup from "yup";

import { appointmentSchema } from "../appointment";

export const requestDocumentsSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    requestType: Yup.string().oneOf(["manual", "automatic"]).required(errorMessages.W4),
    isDeclaration: Yup.boolean(),
    declaration: Yup.boolean().when("isDeclaration", {
      is: true,
      then: Yup.boolean().oneOf([true], errorMessages.W4).required(errorMessages.W4),
    }),
  }).concat(appointmentSchema(errorMessages));

export type RequestDocumentsFormData = Yup.Asserts<
  ReturnType<typeof requestDocumentsSchema>
>;
