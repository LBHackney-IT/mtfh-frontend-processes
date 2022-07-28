import React, { useState } from "react";

import { Form, Formik, useFormikContext } from "formik";

import {
  AppointmentDetails,
  ContactDetails,
  DateTimeFields,
  validate,
} from "../../../../components";
import { HoReviewFormData, hoReviewSchema } from "../../../../schemas";
import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { IProcess, Recommendation } from "../../../../types";
import { getAppointmentDateTime, getPreviousState } from "../../../../utils/processUtil";
import {
  TenureInvestigationRecommendationBox,
  getRecommendation,
} from "../../sole-to-joint-view/states/shared";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Checkbox,
  Dialog,
  DialogActions,
  Field,
  FormGroup,
  Heading,
  InlineField,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  TextArea,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

const { views } = locale;
interface HoReviewViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  setGlobalError: any;
  optional?: any;
}

enum Choice {
  Appointment = "appointment",
  Review = "review",
}

export const HoReviewView = ({
  processConfig,
  process,
  mutate,
  setGlobalError,
  optional,
}: HoReviewViewProps): JSX.Element => {
  const [needAppointment, setNeedAppointment] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { tenant, closeProcessReason, closeCase, setCloseCase } = optional;
  const { currentState } = process;
  const { interviewScheduled, interviewRescheduled, processClosed, processCancelled } =
    processConfig.states;
  const [appointmentTrigger, setAppointmentTrigger] = useState<string>("");

  const errorMessages = useErrorCodes();
  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const processState = [processClosed.state, processCancelled.state].includes(
    currentState.state,
  )
    ? getPreviousState(process)
    : currentState;

  return (
    <Formik<HoReviewFormData>
      initialValues={{
        hoRecommendation: "",
        confirm: false,
        housingAreaManagerName: "",
        choice: "",
        day: "",
        month: "",
        year: "",
        hour: "",
        minute: "",
        amPm: "",
        reason: "",
      }}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={hoReviewSchema(errorMessages)}
      validate={(values) => {
        return validate(errorMessages, values);
      }}
      onSubmit={async (values, { setFieldValue }) => {
        if (values.choice === Choice.Appointment) {
          const appointmentDateTime = getAppointmentDateTime(values);
          let processTrigger: Trigger | string = Trigger.ScheduleInterview;
          if (
            [interviewScheduled.state, interviewRescheduled.state].includes(
              currentState.state,
            )
          ) {
            processTrigger = appointmentTrigger;
          }

          try {
            await editProcess({
              id: process.id,
              processTrigger,
              processName: process?.processName,
              etag: process.etag || "",
              formData: {
                appointmentDateTime,
              },
              documents: [],
              processData: {
                formData: {
                  appointmentDateTime,
                },
                documents: [],
              },
            });
            setFieldValue("choice", "");
            setNeedAppointment(false);
            mutate();
          } catch (e: any) {
            setGlobalError(e.response?.status || 500);
          }
          return;
        }

        if (!modalOpen) {
          setModalOpen(true);
          return;
        }

        setModalOpen(false);
        try {
          await editProcess({
            id: process.id,
            processTrigger: Trigger.HOApproval,
            processName: process?.processName,
            etag: process.etag || "",
            formData: {
              hoRecommendation: values.hoRecommendation?.toLowerCase(),
              housingAreaManagerName: values.housingAreaManagerName,
              reason: values.reason,
            },
            documents: [],
          });
          mutate();
        } catch (e: any) {
          setGlobalError(e.response?.status || 500);
        }
      }}
    >
      {({ values, errors, setFieldValue }) => (
        <>
          {[interviewScheduled.state, interviewRescheduled.state].includes(
            processState.state,
          ) && (
            <AppointmentDetails
              processConfig={processConfig}
              process={process}
              needAppointment={needAppointment}
              setNeedAppointment={(value) => {
                setFieldValue("choice", value ? Choice.Appointment : Choice.Review);
                setFieldValue("day", "");
                setFieldValue("month", "");
                setFieldValue("year", "");
                setFieldValue("hour", "");
                setFieldValue("minute", "");
                setFieldValue("amPm", "");
                setFieldValue("hoRecommendation", "");
                setNeedAppointment(value);
              }}
              setAppointmentTrigger={setAppointmentTrigger}
              closeCase={closeCase || closeProcessReason}
              setCloseCase={setCloseCase}
              options={{
                requestAppointmentTrigger: Trigger.ScheduleInterview,
                rescheduleAppointmentTrigger: Trigger.RescheduleInterview,
                appointmentRequestedState: interviewScheduled.state,
                appointmentRescheduledState: interviewRescheduled.state,
              }}
            />
          )}

          {!closeProcessReason && !closeCase && (
            <Form noValidate>
              <Field id="choice" name="choice" label="" type="radio">
                <RadioGroup>
                  <Heading variant="h4" style={{ marginBottom: 26 }}>
                    Next steps
                  </Heading>
                  {(needAppointment ||
                    ![interviewScheduled.state, interviewRescheduled.state].includes(
                      currentState.state,
                    )) && (
                    <InlineField name="choice" type="radio">
                      <Radio
                        id="ho-appointment"
                        value={Choice.Appointment}
                        onClick={() => {
                          if (values.choice !== Choice.Appointment) {
                            setFieldValue("day", "");
                            setFieldValue("month", "");
                            setFieldValue("year", "");
                            setFieldValue("hour", "");
                            setFieldValue("minute", "");
                            setFieldValue("amPm", "");
                            setFieldValue("hoRecommendation", "");
                          }
                        }}
                      >
                        {views.hoReviewView.makeAppointment}
                      </Radio>
                    </InlineField>
                  )}

                  {values.choice === Choice.Appointment && (
                    <div style={{ marginLeft: 50, marginBottom: 20 }}>
                      <Text>
                        To make an appointment with the applicant for an interview, please
                        use the following details:
                      </Text>
                      {tenant ? (
                        <ContactDetails fullName={tenant.fullName} personId={tenant.id} />
                      ) : (
                        <Text>Tenant not found.</Text>
                      )}
                      <DateTimeFields
                        dateLabel="Interview Date"
                        timeLabel="Interview Time"
                        errors={errors}
                      />
                    </div>
                  )}
                  <InlineField name="choice" type="radio">
                    <Radio
                      id="ho-review"
                      value={Choice.Review}
                      onClick={() => {
                        if (values.choice !== Choice.Review) {
                          setNeedAppointment(false);
                          setFieldValue("day", "01");
                          setFieldValue("month", "01");
                          setFieldValue("year", "3000");
                          setFieldValue("hour", "01");
                          setFieldValue("minute", "01");
                          setFieldValue("amPm", "am");
                        }
                      }}
                    >
                      {views.hoReviewView.passedForReview}
                    </Radio>
                  </InlineField>

                  {values.choice === Choice.Review && !needAppointment && (
                    <div style={{ marginLeft: 50 }}>
                      <Text>{views.hoReviewView.receivedDecision}</Text>
                      <Field
                        id="hoRecommendation"
                        name="hoRecommendation"
                        label="The decision is"
                        type="radio"
                      >
                        <RadioGroup>
                          <Radio
                            id="ho-review-approve"
                            name="hoRecommendation"
                            value={Recommendation.Approve}
                          >
                            {locale.views.tenureInvestigation.approve}
                          </Radio>
                          <Radio
                            id="ho-review-decline"
                            name="hoRecommendation"
                            value={Recommendation.Decline}
                          >
                            {locale.views.tenureInvestigation.decline}
                          </Radio>
                        </RadioGroup>
                      </Field>
                      <FormGroup id="confirm-form-group" error={errors.confirm}>
                        <InlineField name="confirm">
                          <Checkbox id="confirm" name="confirm">
                            {views.hoReviewView.confirmInstructionReceived}
                          </Checkbox>
                        </InlineField>
                      </FormGroup>
                      <FormGroup
                        id="area-housing-manager-name-form-group"
                        error={errors.housingAreaManagerName}
                      >
                        <InlineField name="housingAreaManagerName">
                          <Input
                            id="managerName"
                            style={{ marginLeft: 53, marginTop: 22, maxWidth: 300 }}
                            placeholder={views.hoReviewView.managersName}
                          />
                        </InlineField>
                      </FormGroup>
                    </div>
                  )}
                </RadioGroup>
              </Field>

              <Button
                type="submit"
                disabled={
                  !Object.values(values).some((value) => {
                    return value;
                  })
                }
                style={{ width: 222 }}
              >
                {locale.confirm}
              </Button>

              <HoDecisionModal
                process={process}
                processConfig={processConfig}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
              />
            </Form>
          )}
        </>
      )}
    </Formik>
  );
};

const HoDecisionModal = ({
  process,
  processConfig,
  modalOpen,
  setModalOpen,
}: {
  process: Process;
  processConfig: IProcess;
  modalOpen: boolean;
  setModalOpen: any;
}): JSX.Element => {
  const { handleSubmit, values, errors } = useFormikContext<HoReviewFormData>();
  const hoRecommendation =
    values.hoRecommendation &&
    values.hoRecommendation?.charAt(0)?.toUpperCase() + values.hoRecommendation?.slice(1);
  const { recommendation: tiRecommendation } = getRecommendation(processConfig, process);
  return (
    <Dialog
      isOpen={modalOpen}
      onDismiss={() => setModalOpen(false)}
      title={`${hoRecommendation} ${locale.views.hoReviewModal[
        process.processName.toLowerCase()
      ].toLowerCase()} application?`}
    >
      {tiRecommendation !== hoRecommendation && (
        <TenureInvestigationRecommendationBox
          processConfig={processConfig}
          process={process}
          showInterviewDateTime
        />
      )}

      {tiRecommendation !== hoRecommendation && (
        <FormGroup id="mtfh-ho-review-reason-form-group" error={errors.reason}>
          <Field
            id="mtfh-ho-review-reason"
            name="reason"
            label={`Reason for ${
              hoRecommendation === Recommendation.Approve ? "Approval" : "Rejection"
            }`}
            required
          >
            <TextArea rows={5} />
          </Field>
        </FormGroup>
      )}
      <DialogActions>
        <Button
          type="submit"
          data-testid="confirm-recommendation-modal-submit"
          onClick={() => handleSubmit()}
        >
          {hoRecommendation}
        </Button>
        <Button variant="secondary" onClick={() => setModalOpen(false)}>
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
};
