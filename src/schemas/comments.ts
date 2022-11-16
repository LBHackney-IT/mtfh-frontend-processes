import * as Yup from "yup";

export const commentsSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    description: Yup.string()
      .required(errorMessages.W2)
      .max(1000, "Please reduce the character count to 1000 characters"),
    title: Yup.string().required(errorMessages.W31),
  });

export type CommentsFormData = Yup.Asserts<ReturnType<typeof commentsSchema>>;
