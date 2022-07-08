import { Form, Formik } from "formik";

import {
  FurtherEligibilityFormData,
  furtherEligibilityFormSchema,
} from "../../../../../schemas";
import { IProcess } from "../../../../../types";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Center,
  FormGroup,
  Heading,
  InlineField,
  Radio,
  RadioGroup,
  Spinner,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

interface FurtherEligibilityFormProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  optional?: any;
  setGlobalError: any;
}

export const FurtherEligibilityForm = ({
  process,
  processConfig,
  mutate,
  optional,
  setGlobalError,
}: FurtherEligibilityFormProps): JSX.Element => {
  const { setSubmitted } = optional;
  const stateConfig = processConfig.states.automatedChecksPassed;
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Formik<FurtherEligibilityFormData>
      initialValues={{
        br11: "",
        br12: "",
        br13: "",
        br15: "",
        br16: "",
        br7: "",
        br8: "",
        br20: "",
        br21: "",
      }}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={furtherEligibilityFormSchema(errorMessages)}
      onSubmit={async (values) => {
        try {
          await editProcess({
            id: process.id,
            processTrigger: stateConfig.triggers.checkManualEligibility,
            processName: process?.processName,
            etag: process.etag || "",
            formData: values,
            documents: [],
          });
          setSubmitted(true);
          mutate();
        } catch (e: any) {
          setGlobalError(e.response?.status || 500);
        }
      }}
    >
      {({ values, errors }) => (
        <Form noValidate id="further-eligibility-form">
          <Box>
            <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
              Further eligibility questions
            </Heading>
            <FormGroup
              id="further-eligibility-living-together"
              label="Have the tenant and proposed tenant been living together for 12 months or more, or are they married or in a civil partnership?"
              error={errors.br11}
              required
            >
              <RadioGroup>
                <InlineField name="br11" type="radio">
                  <Radio id="further-eligibility-living-together-yes" value="true">
                    Yes (proposed tenant will be asked for proof e.g. marriage
                    certificate)
                  </Radio>
                </InlineField>
                <InlineField name="br11" type="radio">
                  <Radio id="further-eligibility-living-together-no" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="further-eligibility-main-home"
              label="Do the tenant or proposed tenant intend to occupy any other property besides this one, as their only or main home?"
              error={errors.br12}
              required
            >
              <RadioGroup>
                <InlineField name="br12" type="radio">
                  <Radio id="further-eligibility-main-home-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br12" type="radio">
                  <Radio id="further-eligibility-main-home-no" value="false">
                    No (proposed tenant will be asked for proof e.g. utility bills at
                    address of tenure)
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="further-eligibility-survivor"
              label="Is the tenant the survivor of one or more joint tenants?"
              error={errors.br13}
              required
            >
              <RadioGroup>
                <InlineField name="br13" type="radio">
                  <Radio id="further-eligibility-survivor-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br13" type="radio">
                  <Radio id="further-eligibility-survivor-no" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="further-eligibility-evicted"
              label="Has the prospective tenant been evicted by London Borough of Hackney, another local authority or a housing association?"
              error={errors.br15}
              required
            >
              <RadioGroup>
                <InlineField name="br15" type="radio">
                  <Radio id="further-eligibility-evicted-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br15" type="radio">
                  <Radio id="further-eligibility-evicted-no" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="further-eligibility-immigration"
              label="Is the prospective tenant subject to immigration control under the Asylum And Immigration Act 1996?"
              error={errors.br16}
              required
            >
              <RadioGroup>
                <InlineField name="br16" type="radio">
                  <Radio id="further-eligibility-immigration-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br16" type="radio">
                  <Radio id="further-eligibility-immigration-no" value="false">
                    No (proposed tenant will be asked for proof e.g. passport or
                    immigration status documentation)
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="further-eligibility-seeking-possesion"
              label="Does the tenant have a live notice seeking possession?"
              error={errors.br8}
              required
            >
              <RadioGroup>
                <InlineField name="br8" type="radio">
                  <Radio id="further-eligibility-seeking-possession-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br8" type="radio">
                  <Radio id="further-eligibility-seeking-possession-no" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="further-eligibility-rent-arrears"
              label="Does the tenant have rent arrears over £500?"
              error={errors.br7}
              required
            >
              <RadioGroup>
                <InlineField name="br7" type="radio">
                  <Radio id="further-eligibility-rent-arrears-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                <InlineField name="br7" type="radio">
                  <Radio id="further-eligibility-rent-arrears-no" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
            <FormGroup
              id="further-eligibility-already-joint-tenant"
              label="Does the proposed joint tenant hold a tenancy or property elsewhere?"
              error={errors.br20}
              required
            >
              <RadioGroup>
                <InlineField name="br20" type="radio">
                  <Radio id="further-eligibility-already-joint-tenant-yes" value="true">
                    Yes
                  </Radio>
                </InlineField>
                {values.br20 === "true" && (
                  <FormGroup
                    id="breach-form-tenancy-br10"
                    label=""
                    error={errors.br21}
                    required={false}
                  >
                    <RadioGroup className="govuk-radios__conditional">
                      <InlineField name="br21" type="radio">
                        <Radio
                          id="further-eligibility-already-joint-tenant-yes-tenancy"
                          data-testid="further-eligibility-already-joint-tenant-yes-tenancy"
                          value="tenancy"
                        >
                          Tenancy
                        </Radio>
                      </InlineField>
                      <InlineField name="br21" type="radio">
                        <Radio
                          id="further-eligibility-already-joint-tenant-yes-property"
                          value="property"
                        >
                          Property
                        </Radio>
                      </InlineField>
                      <InlineField name="br21" type="radio">
                        <Radio
                          id="further-eligibility-already-joint-tenant-yes-both"
                          value="both"
                        >
                          Both
                        </Radio>
                      </InlineField>
                    </RadioGroup>
                  </FormGroup>
                )}
                <InlineField name="br20" type="radio">
                  <Radio id="further-eligibility-already-joint-tenant-no" value="false">
                    No
                  </Radio>
                </InlineField>
              </RadioGroup>
            </FormGroup>
          </Box>
          <Button
            type="submit"
            disabled={
              !Object.values(values).some((value) => {
                return value !== "";
              })
            }
          >
            Next
          </Button>
        </Form>
      )}
    </Formik>
  );
};
