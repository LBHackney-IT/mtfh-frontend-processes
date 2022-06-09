import { Form, Formik } from "formik";

import { SoleToJointHeader } from "../../../../components";
import { locale } from "../../../../services";
import { CloseProcessView } from "../../shared/close-process-view";

import { editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  FormGroup,
  Heading,
  InlineField,
  List,
  Radio,
  RadioGroup,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";

const { views } = locale;
const { checkEligibility } = views;

export const BreachCheckForm = ({ process, processConfig, mutate }): JSX.Element => {
  const stateConfig = processConfig.states.manualChecksPassed;
  return (
    <Formik
      initialValues={{ br18: null, br5: null, br10: null, br17: null }}
      onSubmit={async (values) => {
        const formData = {
          ...values,
          br10: values.br10 === null ? "false" : values.br10,
        };
        try {
          await editProcess({
            id: process.id,
            processTrigger: stateConfig.triggers.checkTenancyBreach,
            processName: process?.processName,
            etag: process.etag || "",
            formData,
            documents: [],
          });
          mutate();
        } catch (e: any) {
          console.log(e.response?.status || 500);
        }
      }}
    >
      {(props) => {
        const { br5 } = props.values;
        return (
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
                    <Radio
                      data-testid="breach-form-type-cautionary-yes"
                      id="breach-form-type-cautionary-yes"
                      value="true"
                      onClick={() => {
                        if (br5 === "false") {
                          props.setFieldValue("br10", null);
                        }
                      }}
                    >
                      Yes
                    </Radio>
                  </InlineField>
                  {br5 === "true" && (
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
                  )}
                  <InlineField name="br5" type="radio">
                    <Radio
                      id="breach-form-type-cautionary-no"
                      data-testid="breach-form-type-cautionary-no"
                      value="false"
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
        );
      }}
    </Formik>
  );
};

export const BreachChecksFailedView = ({
  process,
  processConfig,
  mutate,
}): JSX.Element => {
  return (
    <div data-testid="soletojoint-BreachChecksFailed">
      <SoleToJointHeader processConfig={processConfig} process={process} />
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
      <CloseProcessView process={process} processConfig={processConfig} mutate={mutate} />
    </div>
  );
};
