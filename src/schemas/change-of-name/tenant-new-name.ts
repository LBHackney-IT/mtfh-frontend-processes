import * as Yup from "yup";

export const tenantNewNameSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    title: Yup.string().required(errorMessages.W5),
    firstName: Yup.string().required(errorMessages.W56),
    middleName: Yup.string().optional(),
    surname: Yup.string().required(errorMessages.W57),
  });

export type TenantNewNameFormData = Yup.Asserts<ReturnType<typeof tenantNewNameSchema>>;
