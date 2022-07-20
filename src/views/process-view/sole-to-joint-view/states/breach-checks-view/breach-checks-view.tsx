import { useState } from "react";

import { Form, Formik } from "formik";

import { BreachChecksFormData, breachChecksFormSchema } from "../../../../../schemas";
import { locale } from "../../../../../services";

import { editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Center,
  FormGroup,
  Heading,
  InlineField,
  List,
  Radio,
  RadioGroup,
  Spinner,
  StatusErrorSummary,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

const { views } = locale;
const { checkEligibility } = views;

export const BreachCheckForm = ({
  process,
  processConfig,
  mutate,
  setGlobalError,
}): JSX.Element => {
  const stateConfig = processConfig.states.manualChecksPassed;
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Formik<BreachChecksFormData>
      initialValues={{
        br18: "",
        br5: "",
        br10: "",
        br17: "",
      }}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={breachChecksFormSchema(errorMessages)}
      onSubmit={async (values) => {
        try {
          await editProcess({
            id: process.id,
            processTrigger: stateConfig.triggers.checkTenancyBreach,
            processName: process?.processName,
            etag: process.etag || "",
            formData: {
              ...values,
              br10: values.br10 ? values.br10 : false,
            },
            documents: [],
          });
          mutate();
        } catch (e: any) {
          setGlobalError(e.response?.status || 500);
        }
      }}
    >
      {({ values, errors, setFieldValue }) => {
        const { br5 } = values;
        return (
          <Form noValidate id="breach-form" className="mtfh-breach-form">
            <Box>
              <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
                Breach of tenure
              </Heading>
              <FormGroup
                id="breach-form-tenancy-br18"
                label="Other than a NOSP, does the tenant have any live notices against the tenure, e.g. a breach of tenancy"
                error={errors.br18}
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
                id="breach-form-tenancy-br5"
                label="Is the tenant or the proposed tenant a cautionary contact?"
                error={errors.br5}
                required
              >
                <RadioGroup>
                  <InlineField name="br5" type="radio">
                    <Radio
                      data-testid="breach-form-type-cautionary-yes"
                      id="breach-form-type-cautionary-yes"
                      value="true"
                      onClick={() => {
                        if (br5 === "false") {
                          setFieldValue("br10", null);
                        }
                      }}
                    >
                      Yes
                    </Radio>
                  </InlineField>
                  {br5 === "true" && (
                    <FormGroup
                      id="breach-form-tenancy-br10"
                      label=""
                      error={errors.br10}
                      required={false}
                    >
                      <RadioGroup className="govuk-radios__conditional">
                        <InlineField name="br10" type="radio">
                          <Radio
                            id="breach-form-type-cautionary-yes-allow-application"
                            data-testid="breach-form-type-cautionary-yes-allow-application"
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
                    </FormGroup>
                  )}
                  <InlineField name="br5" type="radio">
                    <Radio
                      id="breach-form-type-cautionary-no"
                      data-testid="breach-form-type-cautionary-no"
                      value="false"
                      onClick={() => {
                        setFieldValue("br10", "false");
                      }}
                    >
                      No
                    </Radio>
                  </InlineField>
                </RadioGroup>
              </FormGroup>
              <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
                Succession
              </Heading>
              <FormGroup
                id="breach-form-tenancy-br17"
                label="Has the tenure previously been succeeded?"
                error={errors.br17}
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
        );
      }}
    </Formik>
  );
};

export const BreachChecksView = ({
  process,
  processConfig,
  mutate,
  optional,
}): JSX.Element => {
  const [globalError, setGlobalError] = useState<number>();
  const { manualChecksPassed } = processConfig.states;
  const { submitted, setSubmitted } = optional;
  const {
    currentState: { state },
  } = process;

  return (
    <div data-testid="soletojoint-ManualChecksPassed">
      {globalError && (
        <StatusErrorSummary id="review-application-global-error" code={globalError} />
      )}
      {state === manualChecksPassed.state && submitted && (
        <>
          <Heading variant="h3">Next Steps:</Heading>
          <Text size="sm">
            The current tenant and the applicant have passed the initial eligibility
            requirements. The next steps are:
          </Text>
          <List variant="bullets">
            <Text size="sm">Background checks carried out by the Housing Officer</Text>
            <Text size="sm">A check carried out by the Tenancy Investigation Team</Text>
            <Text size="sm">
              If successful the tenant and proposed joint tenant will need to sign a new
              tenancy agreement
            </Text>
          </List>
          <Button
            style={{ width: 180, marginRight: "100%" }}
            onClick={() => setSubmitted(false)}
          >
            Continue
          </Button>
        </>
      )}
      {state === manualChecksPassed.state && !submitted && (
        <BreachCheckForm
          process={process}
          processConfig={processConfig}
          mutate={mutate}
          setGlobalError={setGlobalError}
        />
      )}
    </div>
  );
};

export const BreachChecksFailedView = (): JSX.Element => {
  return (
    <div data-testid="soletojoint-BreachChecksFailed">
      <Text>{checkEligibility.autoCheckIntro}</Text>
      <Box variant="warning">
        <StatusHeading variant="warning" title={checkEligibility.failedChecks} />{" "}
        <div style={{ marginLeft: "60px" }}>
          <Text size="sm">
            All criteria must be passed in order for the applicant to be eligible. <br />
            Applicant has failed one or more breach of tenure checks.
          </Text>
          <Heading variant="h5">Failed breach of tenure check:</Heading>
          <List variant="bullets">
            <Text size="sm">
              The tenant has a live notice or notices against their tenure
            </Text>
            <Text size="sm">Tenant is a cautionary contact</Text>
            <Text size="sm">The tenant is a survivor of a joint tenancy</Text>
            <Text size="sm">
              Tenures that have previously been succeeded cannot be changed from a sole to
              a joint tenancy
            </Text>
            <Text size="sm">
              The tenant has rent arrears with Hackney or another local authority or
              housing association
            </Text>
          </List>
        </div>
      </Box>
    </div>
  );
};
