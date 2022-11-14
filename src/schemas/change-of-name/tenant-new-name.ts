import * as Yup from "yup";

export const tenantNewNameSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    title: Yup.string().required(errorMessages.W5),
    firstName: Yup.string()
      .matches(/^[a-zA-Z\s-]*$/, errorMessages.W58)
      .required(errorMessages.W56),
    middleName: Yup.string()
      .matches(/^[a-zA-Z\s-]*$/, errorMessages.W58)
      .optional(),
    surname: Yup.string()
      .matches(/^[a-zA-Z\s-]*$/, errorMessages.W58)
      .required(errorMessages.W57),
  });

export type TenantNewNameFormData = Yup.Asserts<ReturnType<typeof tenantNewNameSchema>>;
