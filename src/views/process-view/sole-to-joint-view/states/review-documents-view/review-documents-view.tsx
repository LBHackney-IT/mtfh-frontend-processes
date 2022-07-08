import React, { useState } from "react";

import { Form, Formik } from "formik";

import { SoleToJointHeader } from "../../../../../components";
import { AppointmentDetails } from "../../../../../components/appointment-details/appointment-details";
import { AppointmentForm } from "../../../../../components/appointment-form/appointment-form";
import { ReviewDocumentsFormData, reviewDocumentsSchema } from "../../../../../schemas";
import { locale } from "../../../../../services";
import { Trigger } from "../../../../../services/processes/types";
import { IProcess } from "../../../../../types";
import { DesBox, EligibilityChecksPassedBox } from "../shared";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  FormGroup,
  Heading,
  InlineField,
  Spinner,
  StatusErrorSummary,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

const { views } = locale;
const { reviewDocuments } = views;
interface ReviewDocumentsViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  optional?: any;
}

export const ReviewDocumentsView = ({
  processConfig,
  process,
  mutate,
  optional,
}: ReviewDocumentsViewProps) => {
  const { states } = processConfig;
  const stateConfigs = {
    [states.documentsRequestedDes.state]: processConfig.states.documentsRequestedDes,
    [states.documentsRequestedAppointment.state]:
      processConfig.states.documentsRequestedAppointment,
    [states.documentsAppointmentRescheduled.state]:
      processConfig.states.documentsAppointmentRescheduled,
    [states.processClosed.state]: processConfig.states.processClosed,
  };
  const stateConfig = stateConfigs[process.currentState.state];
  const [globalError, setGlobalError] = useState<number>();
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <div data-testid="soletojoint-ReviewDocuments">
      <SoleToJointHeader processConfig={processConfig} process={process} />

      {globalError && (
        <StatusErrorSummary id="review-documents-global-error" code={globalError} />
      )}
      {!optional?.closeProcessReasonFinal && (
        <>
          <EligibilityChecksPassedBox />
          {(states.documentsRequestedDes.state === process.currentState.state ||
            process.previousStates.find(
              (previous) => previous.state === states.documentsRequestedDes.state,
            )) && <DesBox title={reviewDocuments.documentsRequested} />}

          <ReviewDocumentsAppointmentForm
            processConfig={processConfig}
            process={process}
            mutate={mutate}
            setGlobalError={setGlobalError}
          />

          <div style={{ paddingBottom: 35 }} />

          <Formik<ReviewDocumentsFormData>
            initialValues={{
              seenPhotographicId: false,
              seenSecondId: false,
              isNotInImmigrationControl: false,
              seenProofOfRelationship: false,
              incomingTenantLivingInProperty: false,
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={reviewDocumentsSchema(errorMessages)}
            onSubmit={async (values) => {
              try {
                await editProcess({
                  id: process.id,
                  processTrigger: stateConfig.triggers.reviewDocuments,
                  processName: process?.processName,
                  etag: process.etag || "",
                  formData: values,
                  documents: [],
                });
                mutate();
              } catch (e: any) {
                setGlobalError(e.response?.status || 500);
              }
            }}
          >
            {({ values, errors }) => {
              return (
                <Form
                  noValidate
                  id="review-documents-form"
                  className="review-documents-form"
                >
                  <Heading variant="h4">{reviewDocuments.useFormBelow}</Heading>
                  <FormGroup
                    id="review-documents-form-group"
                    label=""
                    error={
                      errors.seenPhotographicId ||
                      errors.incomingTenantLivingInProperty ||
                      errors.seenSecondId ||
                      errors.seenProofOfRelationship ||
                      errors.isNotInImmigrationControl
                    }
                  >
                    <CheckboxGroup>
                      <InlineField name="seenPhotographicId" type="checkbox">
                        <Checkbox
                          id="seen-photographic-id"
                          hint={reviewDocuments.seenPhotographicIdHint}
                        >
                          {reviewDocuments.seenPhotographicId}
                        </Checkbox>
                      </InlineField>
                      <InlineField name="seenSecondId" type="checkbox">
                        <Checkbox
                          id="seen-second-id"
                          hint={reviewDocuments.seenSecondIdHint}
                        >
                          {reviewDocuments.seenSecondId}
                        </Checkbox>
                      </InlineField>
                      <InlineField name="isNotInImmigrationControl" type="checkbox">
                        <Checkbox
                          id="is-not-immigration-control"
                          hint={reviewDocuments.isNotInImmigrationControlHint}
                        >
                          {reviewDocuments.isNotInImmigrationControl}
                        </Checkbox>
                      </InlineField>
                      <InlineField name="seenProofOfRelationship" type="checkbox">
                        <Checkbox
                          id="seen-proof-of-relationship"
                          hint={reviewDocuments.seenProofOfRelationshipHint}
                        >
                          {reviewDocuments.seenProofOfRelationship}
                        </Checkbox>
                      </InlineField>
                      <InlineField name="incomingTenantLivingInProperty" type="checkbox">
                        <Checkbox
                          id="incoming-tenant-living-in-property"
                          hint={reviewDocuments.incomingTenantLivingInPropertyHint}
                        >
                          {reviewDocuments.incomingTenantLivingInProperty}
                        </Checkbox>
                      </InlineField>
                    </CheckboxGroup>
                  </FormGroup>
                  <Button
                    type="submit"
                    disabled={
                      !Object.values(values).some((value) => {
                        return value;
                      })
                    }
                    style={{ width: 222 }}
                  >
                    {locale.next}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </>
      )}
    </div>
  );
};

interface ReviewDocumentsAppointmentFormProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  setGlobalError: any;
}

export const ReviewDocumentsAppointmentForm = ({
  processConfig,
  process,
  mutate,
  setGlobalError,
}: ReviewDocumentsAppointmentFormProps): JSX.Element => {
  const [needAppointment, setNeedAppointment] = useState<boolean>(false);

  const { states } = processConfig;
  return (
    <>
      <AppointmentDetails
        process={process}
        needAppointment={needAppointment}
        setNeedAppointment={setNeedAppointment}
        options={{
          requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
          appointmentRequestedState: states.documentsRequestedAppointment.state,
          appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
        }}
      />

      {(states.documentsRequestedDes.state === process.currentState.state ||
        needAppointment) && (
        <Checkbox
          id="condition"
          checked={needAppointment}
          onChange={() => setNeedAppointment(!needAppointment)}
        >
          {locale.views.reviewDocuments.checkSupportingDocumentsAppointment}
        </Checkbox>
      )}

      <AppointmentForm
        process={process}
        mutate={mutate}
        setGlobalError={setGlobalError}
        needAppointment={needAppointment}
        setNeedAppointment={setNeedAppointment}
        options={{
          buttonText: locale.bookAppointment,
          requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
          appointmentRequestedState: states.documentsRequestedAppointment.state,
          appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
        }}
      />
    </>
  );
};
