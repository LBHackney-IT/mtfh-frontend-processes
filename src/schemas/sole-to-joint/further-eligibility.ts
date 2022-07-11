import * as Yup from "yup";

export const furtherEligibilityFormSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    br11: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    br12: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    br13: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    br15: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    br16: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    br7: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    br8: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    br9: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    proposedTenantExistingPropertyOrTenure: Yup.string().when("br9", {
      is: "true",
      then: Yup.string()
        .oneOf(["tenancy", "property", "both"])
        .required(errorMessages.W4),
    }),
  });

export type FurtherEligibilityFormData = Yup.Asserts<
  ReturnType<typeof furtherEligibilityFormSchema>
>;
