import * as Yup from "yup";

export const tenantNewNameSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    title: Yup.string().required(errorMessages.W5),
    firstName: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, errorMessages.W8)
      .required(errorMessages.W15),
    middleName: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, errorMessages.W8)
      .optional(),
    surname: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, errorMessages.W8)
      .required(errorMessages.W16),
  });

export type TenantNewNameFormData = Yup.Asserts<ReturnType<typeof tenantNewNameSchema>>;
