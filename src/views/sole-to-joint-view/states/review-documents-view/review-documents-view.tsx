import React, { useState } from "react";

import { Form, Formik } from "formik";

import { SoleToJointHeader } from "../../../../components";
import { AppointmentDetails } from "../../../../components/appointment-details/appointment-details";
import { AppointmentForm } from "../../../../components/appointment-form/appointment-form";
import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { IProcess } from "../../../../types";
import { DesBox, EligibilityChecksPassedBox } from "../shared";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Checkbox,
  Heading,
  StatusErrorSummary,
} from "@mtfh/common/lib/components";

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
  const [seenPhotographicId, setSeenPhotographicId] = useState<boolean>(false);
  const [seenSecondId, setSeenSecondId] = useState<boolean>(false);
  const [isNotInImmigrationControl, setIsNotInImmigrationControl] =
    useState<boolean>(false);
  const [seenProofOfRelationship, setSeenProofOfRelationship] = useState<boolean>(false);
  const [incomingTenantLivingInProperty, setIncomingTenantLivingInProperty] =
    useState<boolean>(false);

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

          <Formik
            initialValues={{}}
            onSubmit={async () => {
              try {
                await editProcess({
                  id: process.id,
                  processTrigger: stateConfig.triggers.reviewDocuments,
                  processName: process?.processName,
                  etag: process.etag || "",
                  formData: {
                    seenPhotographicId,
                    seenSecondId,
                    isNotInImmigrationControl,
                    seenProofOfRelationship,
                    incomingTenantLivingInProperty,
                  },
                  documents: [],
                });
                mutate();
              } catch (e: any) {
                setGlobalError(e.response?.status || 500);
              }
            }}
          >
            {() => {
              return (
                <Form
                  noValidate
                  id="review-documents-form"
                  className="review-documents-form"
                >
                  <Heading variant="h4">{reviewDocuments.useFormBelow}</Heading>
                  <Checkbox
                    id="seen-photographic-id"
                    checked={seenPhotographicId}
                    onChange={() => setSeenPhotographicId(!seenPhotographicId)}
                    hint={reviewDocuments.seenPhotographicIdHint}
                  >
                    {reviewDocuments.seenPhotographicId}
                  </Checkbox>
                  <Checkbox
                    id="seen-second-id"
                    checked={seenSecondId}
                    onChange={() => setSeenSecondId(!seenSecondId)}
                    hint={reviewDocuments.seenSecondIdHint}
                  >
                    {reviewDocuments.seenSecondId}
                  </Checkbox>
                  <Checkbox
                    id="is-not-immigration-control"
                    checked={isNotInImmigrationControl}
                    onChange={() =>
                      setIsNotInImmigrationControl(!isNotInImmigrationControl)
                    }
                    hint={reviewDocuments.isNotInImmigrationControlHint}
                  >
                    {reviewDocuments.isNotInImmigrationControl}
                  </Checkbox>
                  <Checkbox
                    id="seen-proof-of-relationship"
                    checked={seenProofOfRelationship}
                    onChange={() => setSeenProofOfRelationship(!seenProofOfRelationship)}
                    hint={reviewDocuments.seenProofOfRelationshipHint}
                  >
                    {reviewDocuments.seenProofOfRelationship}
                  </Checkbox>
                  <Checkbox
                    id="incoming-tenant-living-in-property"
                    checked={incomingTenantLivingInProperty}
                    onChange={() =>
                      setIncomingTenantLivingInProperty(!incomingTenantLivingInProperty)
                    }
                    hint={reviewDocuments.incomingTenantLivingInPropertyHint}
                  >
                    {reviewDocuments.incomingTenantLivingInProperty}
                  </Checkbox>
                  <Button
                    type="submit"
                    disabled={
                      !seenPhotographicId ||
                      !seenSecondId ||
                      !isNotInImmigrationControl ||
                      !seenProofOfRelationship ||
                      !incomingTenantLivingInProperty
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
