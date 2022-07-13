import * as Yup from "yup";

export const reviewDocumentsSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    seenPhotographicId: Yup.boolean().oneOf([true], errorMessages.W51).required(),
    seenSecondId: Yup.boolean().oneOf([true], errorMessages.W51).required(),
    confirmationForValidDocuments: Yup.boolean()
      .oneOf([true], errorMessages.W51)
      .required(),
  });

export type ReviewDocumentsFormData = Yup.Asserts<
  ReturnType<typeof reviewDocumentsSchema>
>;
