import * as Yup from "yup";

export const reviewDocumentsSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    seenPhotographicId: Yup.boolean().oneOf([true], errorMessages.W51).required(),
    seenSecondId: Yup.boolean().oneOf([true], errorMessages.W51).required(),
    isNotInImmigrationControl: Yup.boolean().oneOf([true], errorMessages.W51).required(),
    seenProofOfRelationship: Yup.boolean().oneOf([true], errorMessages.W51).required(),
    incomingTenantLivingInProperty: Yup.boolean()
      .oneOf([true], errorMessages.W51)
      .required(),
  });

export type ReviewDocumentsFormData = Yup.Asserts<
  ReturnType<typeof reviewDocumentsSchema>
>;
