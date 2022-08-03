import { Form, Formik } from "formik";

import {
  TenureInvestigationFormData,
  tenureInvestigationSchema,
} from "../../../../schemas/tenure-investigation";
import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { ProcessComponentProps, Recommendation } from "../../../../types";

import { editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Checkbox,
  Field,
  FormGroup,
  InlineField,
  Radio,
  RadioGroup,
  Spinner,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

const { views } = locale;

export const TenureInvestigationForm = ({
  process,
  mutate,
  setGlobalError,
}: ProcessComponentProps): JSX.Element => {
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Formik<TenureInvestigationFormData>
      initialValues={{
        tenureInvestigationRecommendation: "",
        completed: false,
      }}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={tenureInvestigationSchema(errorMessages)}
      onSubmit={async (values) => {
        try {
          await editProcess({
            id: process.id,
            processName: process?.processName,
            etag: process.etag || "",
            processTrigger: Trigger.TenureInvestigation,
            formData: {
              tenureInvestigationRecommendation:
                values.tenureInvestigationRecommendation.toLowerCase(),
            },
            documents: [],
          });
          mutate();
        } catch (e: any) {
          setGlobalError(e.response?.status || 500);
        }
      }}
    >
      {({ dirty, errors }) => (
        <Form noValidate style={{ marginTop: 65 }}>
          <Field
            id="tenure-investigation-recommendation"
            name="tenureInvestigationRecommendation"
            label={views.tenureInvestigation.recommendedOutcome}
            type="radio"
            required
          >
            <RadioGroup>
              <Radio
                id="tenure-investigation-recommendation-approve"
                value={Recommendation.Approve}
              >
                {views.tenureInvestigation.approve}
              </Radio>
              <Radio
                id="tenure-investigation-recommendation-appointment"
                value={Recommendation.Appointment}
              >
                {views.tenureInvestigation.appointment}
              </Radio>
              <Radio
                id="tenure-investigation-recommendation-decline"
                value={Recommendation.Decline}
              >
                {views.tenureInvestigation.decline}
              </Radio>
            </RadioGroup>
          </Field>

          <FormGroup id="tenure-investigation-completed" error={errors.completed}>
            <InlineField name="completed" type="checkbox">
              <Checkbox id="tenure-investigation-completed-checkbox">
                {views.tenureInvestigation.tenureInvestigationCompleted}
              </Checkbox>
            </InlineField>
          </FormGroup>

          <Button type="submit" style={{ marginTop: 65, width: 222 }} disabled={!dirty}>
            {locale.confirm}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
