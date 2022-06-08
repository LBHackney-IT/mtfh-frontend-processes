import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Form, Formik } from "formik";

import { locale } from "../../../services";
import { Trigger } from "../../../services/processes/types";
import { IProcess } from "../../../types";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import { Button, Checkbox, Heading, Link, List, Text } from "@mtfh/common/lib/components";

interface CloseProcessViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
}

export const CloseProcessView = ({
  process,
  processConfig,
  mutate,
}: CloseProcessViewProps): JSX.Element => {
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const { state } = process.currentState;
  const { processClosed } = processConfig.states;

  return state === processClosed.state ? (
    <>
      <Heading variant="h3">Outcome letter has been sent</Heading>
      <List variant="bullets" style={{ marginLeft: "1em" }}>
        <Text size="sm">
          This has been recorded and can be viewed in the case activity history
        </Text>
      </List>
      <div style={{ marginTop: "1em" }}>
        <Link as={RouterLink} to="" variant="back-link">
          Return to home page
        </Link>
      </div>
    </>
  ) : (
    <>
      <Heading variant="h3">Next steps:</Heading>
      <Formik
        initialValues={{}}
        onSubmit={async () => {
          try {
            await editProcess({
              id: process.id,
              processTrigger: Trigger.CloseProcess,
              processName: process?.processName,
              etag: process.etag || "",
              formData: {
                hasNotifiedResident: true,
              },
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
              {locale.views.closeCase.outcomeLetterSent}
            </Checkbox>
            <Button type="submit" disabled={!confirmed}>
              {locale.confirm}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
