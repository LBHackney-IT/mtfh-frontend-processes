import * as Yup from "yup";

import { Recommendation } from "../../types";
import { appointmentSchema } from "../appointment";

export const hoReviewSchema = (errorMessages: Record<string, string>) =>
  Yup.object({
    hoRecommendation: Yup.string().when("choice", {
      is: "review",
      then: Yup.string()
        .oneOf([Recommendation.Approve, Recommendation.Decline])
        .required(errorMessages.W4),
    }),
    choice: Yup.string().oneOf(["appointment", "review"]).required(errorMessages.W4),
    housingAreaManagerName: Yup.string().when("choice", {
      is: "review",
      then: Yup.string().min(2, errorMessages.W27).required(errorMessages.W53),
    }),
    confirm: Yup.boolean().when("choice", {
      is: "review",
      then: Yup.boolean().oneOf([true], errorMessages.W4).required(),
    }),
    reason: Yup.string(),
  }).concat(appointmentSchema(errorMessages));

export type HoReviewFormData = Yup.Asserts<ReturnType<typeof hoReviewSchema>>;
