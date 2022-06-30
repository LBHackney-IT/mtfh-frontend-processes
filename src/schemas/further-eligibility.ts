import * as Yup from "yup";

export const furtherEligibilityFormSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    br11: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
    br12: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
    br13: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
    br15: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
    br16: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
    br7: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
    br8: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
  });

export type FurtherEligibilityFormData = Yup.Asserts<
  ReturnType<typeof furtherEligibilityFormSchema>
>;
