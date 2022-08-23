import React from "react";

import { Form, Formik } from "formik";

import {
  AppointmentFormData,
  appointmentSchema,
  dateTimeIsValid,
} from "../../schemas/appointment";
import { locale } from "../../services";
import { Trigger } from "../../services/processes/types";
import { getAppointmentDateTime } from "../../utils/processUtil";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  DateField,
  FormGroup,
  Spinner,
  TimeField,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

import "./styles.scss";

interface BookAppointmentFormProps {
  process: Process;
  mutate: () => void;
  needAppointment: boolean;
  setGlobalError: any;
  setNeedAppointment?: any;
  appointmentTrigger: Trigger | string;
  options: {
    buttonText?: string;
    requestAppointmentTrigger: string;
    rescheduleAppointmentTrigger: string;
    appointmentRequestedState: string;
    appointmentRescheduledState: string;
  };
}

export const AppointmentForm = ({
  process,
  mutate,
  setGlobalError,
  needAppointment,
  setNeedAppointment,
  appointmentTrigger,
  options,
}: BookAppointmentFormProps): JSX.Element => {
  const { currentState } = process;
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
      <Formik<AppointmentFormData>
        initialValues={{ day: "", month: "", year: "", hour: "", minute: "", amPm: "" }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={appointmentSchema(errorMessages)}
        validate={(values) => {
          return validate(errorMessages, values);
        }}
        onSubmit={async (values) => {
          const appointmentDateTime = getAppointmentDateTime(values);
          let processTrigger = options.requestAppointmentTrigger;
          if (
            [
              options.appointmentRequestedState,
              options.appointmentRescheduledState,
            ].includes(currentState.state)
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
            setNeedAppointment(!needAppointment);
            mutate();
          } catch (e: any) {
            setGlobalError(e.response?.status || 500);
          }
        }}
      >
        {({ values, errors }) => {
          return (
            needAppointment && (
              <Form
                noValidate
                id="request-appointment-form"
                className="request-appointment-form"
              >
                <DateTimeFields errors={errors} values={values} />
                <Button
                  type="submit"
                  disabled={
                    !Object.values(values).some((value) => {
                      return value !== "";
                    })
                  }
                  style={{ width: 245 }}
                >
                  {options.buttonText || locale.confirm}
                </Button>
              </Form>
            )
          );
        }}
      </Formik>
    </>
  );
};

export const validate = (errorMessages, values) => {
  if (
    values.year ||
    values.month ||
    values.day ||
    values.hour ||
    values.minute ||
    values.amPm
  ) {
    const result = dateTimeIsValid(errorMessages, values);
    if (result === true) {
      return {};
    }
    return { global: result };
  }
};

export const isOutOfHours = (amPm, hourString) => {
  const hour = parseInt(hourString, 10);
  return !!amPm && (amPm === "am" ? hour < 8 || hour === 12 : hour > 7 && hour !== 12);
};

export const DateTimeFields = ({
  dateLabel = "Date",
  timeLabel = "Time",
  errors,
  values,
}: {
  dateLabel?: string;
  timeLabel?: string;
  errors?: any;
  values?: Record<string, any>;
}): JSX.Element => {
  return (
    <FormGroup
      id="appointment-form-date-time-form-group"
      error={
        errors?.global ||
        (values &&
          isOutOfHours(values.amPm, values.hour) &&
          "Please check the appointment time as it is out of normal office hours.")
      }
    >
      <FormGroup
        id="appointment-form-date-time-field-form-group"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          marginTop: 0,
        }}
      >
        <>
          <DateField
            id="appointment-form-date"
            className="mtfh-appointment-form__date"
            label={dateLabel}
            dayLabel=""
            monthLabel=""
            yearLabel=""
            dayProps={{ name: "day", placeholder: "dd" }}
            monthProps={{ name: "month", placeholder: "mm" }}
            yearProps={{ name: "year", placeholder: "yyyy" }}
            style={{ flex: "1 1 280px" }}
            required
          />
          <TimeField
            id="appointment-form-time"
            className="mtfh-appointment-form__time"
            label={timeLabel}
            hourLabel=""
            minuteLabel=""
            amPmLabel=""
            hourProps={{ name: "hour", placeholder: "00" }}
            minuteProps={{ name: "minute", placeholder: "00" }}
            amPmProps={{ name: "amPm" }}
            style={{ flex: "1 1 280px" }}
            required
          />
        </>
      </FormGroup>
    </FormGroup>
  );
};
