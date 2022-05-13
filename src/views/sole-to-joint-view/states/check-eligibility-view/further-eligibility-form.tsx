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

export const FurtherEligibilityForm = ({
  process,
  processConfig,
  onSuccessfulSubmit,
}): JSX.Element => {
  const stateConfig = processConfig.states.automatedChecksPassed;
  return (
    <Formik
      initialValues={{
        br11: null,
        br12: null,
        br13: null,
        br14: null,
        br15: null,
        br7: null,
        br8: null,
      }}
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
          onSuccessfulSubmit();
        } catch (e: any) {
          console.log(e.response?.status || 500);
        }
      }}
    >
      {(props) => (
        <Form noValidate id="person-form" className="mtfh-person-form">
          <Box>
            <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
              Further eligibility questions
            </Heading>
            <FormGroup
              id="person-form-personType"
              label="Have the tenant and proposed tenant been living together for 12 months or more, or are they married or in a civil partnership?"
              error={props.errors.br11}
              required
            >
              <RadioGroup>
                <InlineField name="br11" type="radio">
                  <Radio id="person-form-type-tenure-holder" value="true">
                    Yes (proposed tenant will be asked for proof e.g. marriage
                    certificate)
                  </Radio>
                </InlineField>
                <InlineField name="br11" type="radio">
                  <Radio id="person-form-type-household-member" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="person-form-personType"
              label="Do the tenant or proposed tenant intend to occupy any other property besides this one, as their only or main home?"
              error={props.errors.br12}
              required
            >
              <RadioGroup>
                <InlineField name="br12" type="radio">
                  <Radio id="person-form-type-tenure-holder" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br12" type="radio">
                  <Radio id="person-form-type-household-member" value="false">
                    No (proposed tenant will be asked for proof e.g. utility bills at
                    address of tenure)
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="person-form-personType"
              label="Is the tenant the survivor of one or more joint tenants?"
              error={props.errors.br13}
              required
            >
              <RadioGroup>
                <InlineField name="br13" type="radio">
                  <Radio id="person-form-type-tenure-holder" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br13" type="radio">
                  <Radio id="person-form-type-household-member" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="person-form-personType"
              label="Has the prospective tenant been evicted by London Borough of Hackney, another local authority or a housing association?"
              error={props.errors.br14}
              required
            >
              <RadioGroup>
                <InlineField name="br15" type="radio">
                  <Radio id="person-form-type-tenure-holder" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br15" type="radio">
                  <Radio id="person-form-type-household-member" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="person-form-personType"
              label="Is the prospective tenant subject to immigration control under the Asylum And Immigration Act 1996?"
              error={props.errors.br15}
              required
            >
              <RadioGroup>
                <InlineField name="br16" type="radio">
                  <Radio id="person-form-type-tenure-holder" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br16" type="radio">
                  <Radio id="person-form-type-household-member" value="false">
                    No (proposed tenant will be asked for proof e.g. passport or
                    immigration status documentation)
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="person-form-seeking-possesion"
              label="Does the tenant have a live notice seeking possesion?"
              error={props.errors.br7}
              required
            >
              <RadioGroup>
                <InlineField name="br7" type="radio">
                  <Radio id="person-form-seeking-possesion-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br7" type="radio">
                  <Radio id="person-form-seeking-possesion-no" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="person-form-rent-arrears"
              label="Does the tenant have rent arrears over £500?"
              error={props.errors.br8}
              required
            >
              <RadioGroup>
                <InlineField name="br8" type="radio">
                  <Radio id="person-form-rent-arrears-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br8" type="radio">
                  <Radio id="person-form-rent-arrears-no" value="false">
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
