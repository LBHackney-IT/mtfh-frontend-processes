import React, { useEffect, useState } from "react";

import { isPast } from "date-fns";
import { Form, Formik } from "formik";

import {
  AppointmentDetails,
  ContactDetails,
  DateTimeFields,
  validate,
} from "../../../../../components";
import { HoReviewFormData, hoReviewSchema } from "../../../../../schemas";
import { locale } from "../../../../../services";
import { Trigger } from "../../../../../services/processes/types";
import { IProcess } from "../../../../../types";
import { getAppointmentDateTime } from "../../../../../utils/processUtil";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Checkbox,
  Field,
  FormGroup,
  Heading,
  InlineField,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Text,
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

enum HORecommendation {
  Approve = "approve",
  Decline = "decline",
}

export const HoReviewView = ({
  processConfig,
  process,
  mutate,
  setGlobalError,
  optional,
}: HoReviewViewProps): JSX.Element => {
  const [choice, setChoice] = useState<Choice | undefined>();
  const [needAppointment, setNeedAppointment] = useState<boolean>(false);

  const { currentState } = process;
  const { interviewScheduled, interviewRescheduled } = processConfig.states;
  const formData = process.currentState.processData.formData as {
    appointmentDateTime: string;
  };

  useEffect(() => {
    if (needAppointment) {
      setChoice(Choice.Appointment);
    }
  }, [needAppointment]);

  const errorMessages = useErrorCodes();
  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      {[interviewScheduled.state, interviewRescheduled.state].includes(
        process.currentState.state,
      ) && (
        <AppointmentDetails
          process={process}
          needAppointment={needAppointment}
          setNeedAppointment={setNeedAppointment}
          options={{
            requestAppointmentTrigger: Trigger.ScheduleInterview,
            rescheduleAppointmentTrigger: Trigger.RescheduleInterview,
            appointmentRequestedState: interviewScheduled.state,
            appointmentRescheduledState: interviewRescheduled.state,
          }}
        />
      )}

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
        }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={hoReviewSchema(errorMessages)}
        validate={(values) => {
          return validate(errorMessages, values);
        }}
        onSubmit={async (values) => {
          if (choice === Choice.Appointment) {
            const appointmentDateTime = getAppointmentDateTime(values);
            let processTrigger: Trigger | string = Trigger.ScheduleInterview;
            if (
              [interviewScheduled.state, interviewRescheduled.state].includes(
                currentState.state,
              )
            ) {
              if (isPast(new Date(formData.appointmentDateTime))) {
                processTrigger = Trigger.RescheduleInterview;
              } else {
                processTrigger = "";
              }
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
              setNeedAppointment(false);
              setChoice(undefined);
              mutate();
            } catch (e: any) {
              setGlobalError(e.response?.status || 500);
            }
            return;
          }
          try {
            await editProcess({
              id: process.id,
              processTrigger: Trigger.HOApproval,
              processName: process?.processName,
              etag: process.etag || "",
              formData: {
                hoRecommendation: values.hoRecommendation,
                housingAreaManagerName: values.housingAreaManagerName,
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
          <Form noValidate>
            <Field id="choice" name="choice" label="" type="radio">
              <RadioGroup>
                <Heading variant="h4" style={{ marginBottom: 26 }}>
                  Next steps
                </Heading>
                <Radio
                  id="ho-appointment"
                  value={Choice.Appointment}
                  onChange={() => {
                    setNeedAppointment(true);
                    setChoice(Choice.Appointment);
                  }}
                  checked={choice === Choice.Appointment && needAppointment}
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

                {choice === Choice.Appointment && needAppointment && (
                  <div style={{ marginLeft: 50, marginBottom: 20 }}>
                    <Text>
                      To make an appointment with the applicant for an interview, please
                      use the following details:
                    </Text>
                    {optional.tenant ? (
                      <>
                        <ContactDetails
                          fullName={optional.tenant.fullName}
                          personId={optional.tenant.id}
                        />
                      </>
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

                <Radio
                  id="ho-review"
                  value={Choice.Review}
                  onChange={() => {
                    setNeedAppointment(false);
                    setChoice(Choice.Review);
                  }}
                  checked={choice === Choice.Review}
                  onClick={() => {
                    if (choice !== Choice.Review) {
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

                {choice === Choice.Review && !needAppointment && (
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
                          value={HORecommendation.Approve}
                        >
                          {locale.views.tenureInvestigation.approve}
                        </Radio>
                        <Radio
                          id="ho-review-decline"
                          name="hoRecommendation"
                          value={HORecommendation.Decline}
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
          </Form>
        )}
      </Formik>
    </>
  );
};
