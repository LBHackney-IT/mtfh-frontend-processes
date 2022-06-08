import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Form, Formik } from "formik";

import { SoleToJointHeader } from "../../../../components";
import { AppointmentDetails } from "../../../../components/appointment-details/appointment-details";
import { AppointmentForm } from "../../../../components/appointment-form/appointment-form";
import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { IProcess } from "../../../../types";
import { EligibilityChecksPassedBox } from "../shared";
import { CloseCaseForm, CloseCaseFormData } from "../submit-case-view/close-case-form";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  Heading,
  Link,
  List,
  StatusErrorSummary,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";

const { views } = locale;
const { reviewDocuments } = views;
interface ReviewDocumentsViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
}

export const ReviewDocumentsView = ({
  processConfig,
  process,
  mutate,
}: ReviewDocumentsViewProps) => {
  const [seenPhotographicId, setSeenPhotographicId] = useState<boolean>(false);
  const [seenSecondId, setSeenSecondId] = useState<boolean>(false);
  const [isNotInImmigrationControl, setIsNotInImmigrationControl] =
    useState<boolean>(false);
  const [seenProofOfRelationship, setSeenProofOfRelationship] = useState<boolean>(false);
  const [incomingTenantLivingInProperty, setIncomingTenantLivingInProperty] =
    useState<boolean>(false);
  const [isCloseCase, setIsCloseCase] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [hasNotifiedResident, setHasNotifiedResident] = useState<boolean>(false);

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
      {reason || process.currentState.state === states.processClosed.state ? (
        <>
          <Box variant="warning">
            <StatusHeading variant="warning" title={reviewDocuments.soleToJointClosed} />
            <Text style={{ marginLeft: 60 }}>
              {reason || process.currentState.processData.formData.reason}
            </Text>
          </Box>
          {process.currentState.state !== states.processClosed.state ? (
            <Formik
              initialValues={{}}
              onSubmit={async () => {
                try {
                  await editProcess({
                    id: process.id,
                    processTrigger: stateConfig.triggers.closeProcess,
                    processName: process?.processName,
                    etag: process.etag || "",
                    formData: {
                      hasNotifiedResident,
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
                    <Heading variant="h4">Next Steps:</Heading>
                    <Checkbox
                      id="outcome-letter-sent"
                      checked={hasNotifiedResident}
                      onChange={() => setHasNotifiedResident(!hasNotifiedResident)}
                    >
                      {views.closeCase.outcomeLetterSent}
                    </Checkbox>
                    <Button
                      type="submit"
                      disabled={!hasNotifiedResident}
                      style={{ width: 222 }}
                    >
                      {locale.confirm}
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          ) : (
            <>
              <Heading variant="h3">{reviewDocuments.thankYouForConfirmation}</Heading>
              <List variant="bullets">
                <Text size="sm">{reviewDocuments.confirmation}</Text>
              </List>
              <div style={{ marginTop: 35 }}>
                <Link as={RouterLink} to="" variant="back-link">
                  {locale.returnHomePage}
                </Link>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <EligibilityChecksPassedBox />
          {(states.documentsRequestedDes.state === process.currentState.state ||
            process.previousStates.find(
              (previous) => previous.state === states.documentsRequestedDes.state,
            )) && (
            <Box variant="success">
              <StatusHeading
                variant="success"
                title={reviewDocuments.documentsRequested}
              />
              <div
                style={{ marginLeft: 60, marginTop: 17.5 }}
                className="govuk-link lbh-link lbh-link--no-visited-state"
              >
                <Link as={RouterLink} to="#" variant="link">
                  {reviewDocuments.viewInDes}
                </Link>
              </div>
            </Box>
          )}

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
          <Formik<CloseCaseFormData>
            initialValues={{ reasonForRejection: "" }}
            onSubmit={async (values) => {
              setReason(values.reasonForRejection);
              setIsCloseCase(false);
            }}
          >
            <Dialog
              isOpen={isCloseCase}
              onDismiss={() => setIsCloseCase(false)}
              title={locale.views.closeCase.closeApplication("sole to joint")}
            >
              <Form>
                <CloseCaseForm />
                <DialogActions>
                  <Button type="submit">{locale.confirm}</Button>
                  <Link as="button" onClick={() => setIsCloseCase(false)}>
                    {locale.cancel}
                  </Link>
                </DialogActions>
              </Form>
            </Dialog>
          </Formik>

          <Text size="md">{reviewDocuments.documentsNotSuitableCloseCase}</Text>
          <Button
            variant="secondary"
            onClick={() => setIsCloseCase(true)}
            style={{ width: 222 }}
          >
            {locale.closeCase}
          </Button>
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
