import * as Yup from "yup";

export const breachChecksFormSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    br5: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    br10: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    br17: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
    br18: Yup.string().oneOf(["true", "false"]).required(errorMessages.W4),
  });

export type BreachChecksFormData = Yup.Asserts<ReturnType<typeof breachChecksFormSchema>>;
