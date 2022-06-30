import * as Yup from "yup";

export const breachChecksFormSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    br5: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
    br10: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
    br17: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
    br18: Yup.string()
      .oneOf(["true", "false", null])
      .required(errorMessages.W4)
      .nullable(true),
  });

export type BreachChecksFormData = Yup.Asserts<ReturnType<typeof breachChecksFormSchema>>;
