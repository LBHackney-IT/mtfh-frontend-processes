import * as Yup from "yup";

export const furtherEligibilityFormSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    br11: Yup.boolean().required(errorMessages.W4).default(undefined),
    br12: Yup.boolean().required(errorMessages.W4).default(undefined),
    br13: Yup.boolean().required(errorMessages.W4).default(undefined),
    br15: Yup.boolean().required(errorMessages.W4).default(undefined),
    br16: Yup.boolean().required(errorMessages.W4).default(undefined),
    br7: Yup.boolean().required(errorMessages.W4).default(undefined),
    br8: Yup.boolean().required(errorMessages.W4).default(undefined),
  });

export type FurtherEligibilityFormData = Yup.Asserts<
  ReturnType<typeof furtherEligibilityFormSchema>
>;
