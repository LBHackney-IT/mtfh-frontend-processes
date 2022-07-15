import * as Yup from "yup";

import { Recommendation } from "../types";

export const tenureInvestigationSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    tenureInvestigationRecommendation: Yup.string()
      .oneOf([Recommendation.Approve, Recommendation.Decline, Recommendation.Appointment])
      .required(errorMessages.W4),
    completed: Yup.boolean().oneOf([true], errorMessages.W4).required(),
  });

export type TenureInvestigationFormData = Yup.Asserts<
  ReturnType<typeof tenureInvestigationSchema>
>;
