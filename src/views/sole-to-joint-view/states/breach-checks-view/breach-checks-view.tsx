import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Form, Formik } from "formik";

import { SoleToJointHeader } from "../../../../components";
import { locale } from "../../../../services";

import { editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Checkbox,
  Heading,
  Link,
  List,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";

const { views } = locale;
const { checkEligibility } = views;

export const BreachChecksFailedView = ({
  process,
  processConfig,
  mutate,
}): JSX.Element => {
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const { breachChecksFailed, processCancelled } = processConfig.states;
  const { state } = process.currentState;

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
      {state === processCancelled.state ? (
        <>
          <Heading variant="h3">Outcome letter has been sent</Heading>
          <List variant="bullets" style={{ marginLeft: "1em" }}>
            <Text size="sm">
              This has been recorded and can be viewed in the case activity history
            </Text>
          </List>
          <div style={{ marginTop: "1em" }}>
            <Link as={RouterLink} to="" variant="link">
              Return to home page
            </Link>
          </div>
        </>
      ) : (
        <>
          <Heading variant="h3">Next steps:</Heading>
          <Formik
            initialValues={{}}
            onSubmit={async (values) => {
              try {
                await editProcess({
                  id: process.id,
                  processTrigger: breachChecksFailed.triggers.cancelProcess,
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
            {() => (
              <Form noValidate id="breach-form" className="mtfh-breach-form">
                <Checkbox
                  id="condition"
                  checked={confirmed}
                  onChange={() => setConfirmed(!confirmed)}
                >
                  I confirm that an outcome letter has been sent to the resident
                </Checkbox>
                <Button type="submit" disabled={!confirmed}>
                  Confirm
                </Button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};
