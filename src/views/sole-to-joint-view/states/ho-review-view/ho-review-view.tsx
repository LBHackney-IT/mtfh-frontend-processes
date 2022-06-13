import React, { useEffect, useState } from "react";

import { isPast } from "date-fns";
import { Form, Formik } from "formik";

import { AppointmentDetails } from "../../../../components/appointment-details/appointment-details";
import {
  DateTimeFields,
  validate,
} from "../../../../components/appointment-form/appointment-form";
import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { IProcess } from "../../../../types";
import { TenantContactDetails, getAppointmentDateTime } from "../shared";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Checkbox,
  Field,
  Heading,
  InlineField,
  Input,
  Radio,
  RadioGroup,
  Text,
} from "@mtfh/common/lib/components";

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

enum Decision {
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
  const [disabled, setDisabled] = useState<boolean>(true);
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

      <Formik
        initialValues={{
          decision: undefined,
          confirm: false,
          managerName: "",
          choice,
          day: "",
          month: "",
          year: "",
          hour: "",
          minute: "",
          amPm: "",
        }}
        enableReinitialize
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
                hORecommendation: values.decision,
              },
              documents: [],
            });
            mutate();
          } catch (e: any) {
            setGlobalError(e.response?.status || 500);
          }
        }}
        validateOnChange
        validateOnBlur
        validate={(values) => {
          console.log("validate", values.choice);
          if (values.choice === Choice.Appointment) {
            validate(values, setDisabled);
            return;
          }
          if (values.choice === Choice.Review) {
            if (
              values.decision !== undefined &&
              values.confirm &&
              values.managerName !== ""
            ) {
              setDisabled(false);
            } else {
              setDisabled(true);
            }
          }
        }}
      >
        {() => (
          <Form>
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
                >
                  Make an appointment with the applicant for an interview
                </Radio>

                {choice === Choice.Appointment && needAppointment && (
                  <div style={{ marginLeft: 50, marginBottom: 20 }}>
                    <Text>
                      To make an appointment with the applicant for an interview, please
                      use the following details:
                    </Text>
                    {optional.tenant ? (
                      <>
                        <TenantContactDetails tenant={optional.tenant} />
                      </>
                    ) : (
                      <Text>Tenant not found.</Text>
                    )}
                    <DateTimeFields
                      dateLabel="Interview Date"
                      timeLabel="Interview Time"
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
                >
                  I have passed the case to the Housing Manager for review and received a
                  decision
                </Radio>

                {choice === Choice.Review && !needAppointment && (
                  <div style={{ marginLeft: 50 }}>
                    <Text>
                      The case has received area housing manager’s final decision.
                    </Text>
                    <Field
                      id="decision"
                      name="decision"
                      label="The decision is"
                      type="radio"
                    >
                      <RadioGroup>
                        <Radio id="ho-review" value={Decision.Approve}>
                          {locale.views.tenureInvestigation.approve}
                        </Radio>
                        <Radio id="ho-review" value={Decision.Decline}>
                          {locale.views.tenureInvestigation.decline}
                        </Radio>
                      </RadioGroup>
                    </Field>
                    <InlineField name="confirm">
                      <Checkbox id="confirm" name="confirm">
                        I confirm that this is an instruction received by the housing area
                        manager
                      </Checkbox>
                    </InlineField>
                    <InlineField name="managerName">
                      <Input
                        id="managerName"
                        style={{ marginLeft: 53, marginTop: 22, maxWidth: 300 }}
                        placeholder="Enter manager's name"
                      />
                    </InlineField>
                  </div>
                )}
              </RadioGroup>
            </Field>

            <Button type="submit" disabled={disabled} style={{ width: 222 }}>
              {locale.confirm}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
