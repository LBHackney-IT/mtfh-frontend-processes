import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { IProcess, ProcessComponentProps } from "../../../../types";
import { isSameState } from "../../../../utils/processUtil";

import { editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Checkbox,
  Heading,
  InlineField,
  Link,
  List,
  StatusBox,
  Text,
} from "@mtfh/common/lib/components";

const closeProcessSchema = () =>
  Yup.object({
    hasNotifiedResident: Yup.boolean(),
  });

type CloseProcessFormData = Yup.Asserts<ReturnType<typeof closeProcessSchema>>;

interface CloseProcessViewProps extends ProcessComponentProps {
  processConfig: IProcess;
  setGlobalError?: any;
  closeProcessReason?: string;
  statusBox?: boolean;
  trigger?: string;
}

export const CloseProcessView = ({
  process,
  processConfig,
  mutate,
  setGlobalError,
  closeProcessReason,
  statusBox = true,
  trigger,
}: CloseProcessViewProps): JSX.Element => {
  const { state } = process.currentState;
  const { processCancelled, processClosed, tenureUpdated } = processConfig.states;

  return (
    <>
      {statusBox && (
        <StatusBox
          variant="warning"
          title={
            isSameState(process.currentState, processClosed)
              ? locale.views.reviewDocuments.soleToJointClosed
              : locale.views.reviewDocuments.soleToJointWillBeClosed
          }
        >
          {closeProcessReason && (
            <Text style={{ marginTop: 15 }}>{closeProcessReason}</Text>
          )}
        </StatusBox>
      )}

      {[processClosed.state, processCancelled.state, tenureUpdated.state].includes(
        state,
      ) ? (
        <>
          <Heading variant="h3">
            {locale.views.closeProcess.thankYouForConfirmation}
          </Heading>
          <List variant="bullets" style={{ marginLeft: "1em" }}>
            <Text size="sm">{locale.views.closeProcess.confirmationText}</Text>
          </List>
          <div style={{ marginTop: "1em" }}>
            <Link as={RouterLink} to="" variant="back-link">
              {locale.returnHomePage}
            </Link>
          </div>
        </>
      ) : (
        <>
          <Heading variant="h3">Next steps:</Heading>
          <Formik<CloseProcessFormData>
            initialValues={{
              hasNotifiedResident: false,
            }}
            onSubmit={async () => {
              try {
                await editProcess({
                  id: process.id,
                  processTrigger: trigger || Trigger.CloseProcess,
                  processName: process?.processName,
                  etag: process.etag || "",
                  formData: {
                    hasNotifiedResident: true,
                    Reason: closeProcessReason,
                  },
                  documents: [],
                });
                mutate();
              } catch (e: any) {
                if (setGlobalError) {
                  setGlobalError(e.response?.status || 500);
                } else {
                  console.log(e.response?.status || 500);
                }
              }
            }}
          >
            {({ values }) => (
              <Form
                noValidate
                id="close-process-form"
                className="mtfh-close-process-form"
              >
                <InlineField name="hasNotifiedResident" type="checkbox">
                  <Checkbox id="condition">
                    {locale.views.closeProcess.outcomeLetterSent}
                  </Checkbox>
                </InlineField>
                <Button type="submit" disabled={!values.hasNotifiedResident}>
                  {locale.confirm}
                </Button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </>
  );
};
