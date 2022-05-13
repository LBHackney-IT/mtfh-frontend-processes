import { Form, Formik } from "formik";

import { editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  FormGroup,
  Heading,
  InlineField,
  Radio,
  RadioGroup,
} from "@mtfh/common/lib/components";

export const BreachCheckForm = ({ process, processConfig, mutate }): JSX.Element => {
  const stateConfig = processConfig.states.breachChecksPassed;
  return (
    <Formik
      initialValues={{ br18: null, br5: null, br10: null, br17: null }}
      onSubmit={async (values) => {
        try {
          await editProcess({
            id: process.id,
            processTrigger: stateConfig.trigger,
            processName: process?.processName,
            etag: process.etag || "",
            formData: values,
            documents: [],
          });
          mutate();
        } catch (e: any) {
          console.log(e.response?.status || 500);
        }
      }}
    >
      {(props) => (
        <Form noValidate id="breach-form" className="mtfh-breach-form">
          <Box>
            <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
              Breach of tenure
            </Heading>
            <FormGroup
              id="breach-form-tenancy"
              label="Other than a NOSP, does the tenant have any live notices against the tenure, e.g. a breach of tenancy"
              error={props.errors.br18}
              required
            >
              <RadioGroup>
                <InlineField name="br18" type="radio">
                  <Radio id="breach-form-type-notice-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br18" type="radio">
                  <Radio id="breach-form-type-notice-no" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
              Cautionary contact
            </Heading>
            <FormGroup
              id="breach-form-tenancy"
              label="Is the tenant or the proposed tenant a cautionary contact?"
              error={props.errors.br5}
              required
            >
              <RadioGroup>
                <InlineField name="br5" type="radio">
                  <Radio id="breach-form-type-cautionary-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <RadioGroup className="govuk-radios__conditional">
                  <InlineField name="br10" type="radio">
                    <Radio
                      id="breach-form-type-cautionary-yes-allow-application"
                      value="true"
                    >
                      Allow application to proceed
                    </Radio>
                  </InlineField>
                  <InlineField name="br10" type="radio">
                    <Radio
                      id="breach-form-type-cautionary-yes-deny-application"
                      value="false"
                    >
                      Deny application
                    </Radio>
                  </InlineField>
                </RadioGroup>
                <InlineField name="br5" type="radio">
                  <Radio id="breach-form-type-cautionary-yes" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
              Succession
            </Heading>
            <FormGroup
              id="breach-form-tenancy"
              label="Has the tenure previously been succeeded?"
              error={props.errors.br17}
              required
            >
              <RadioGroup>
                <InlineField name="br17" type="radio">
                  <Radio id="breach-form-type-previously-succeeded-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br17" type="radio">
                  <Radio id="breach-form-type-previously-succeeded-no" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
          </Box>
          <Button type="submit">Next</Button>
        </Form>
      )}
    </Formik>
  );
};
