import { useState } from "react";

import { isPast } from "date-fns";
import { Form, Formik } from "formik";

import { locale } from "../../services";
import { getAppointmentDateTime } from "../../views/sole-to-joint-view/states/shared";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import { Button, DateField, TimeField } from "@mtfh/common/lib/components";
import { dateToString, isFutureDate } from "@mtfh/common/lib/utils";

interface BookAppointmentFormProps {
  process: Process;
  mutate: () => void;
  needAppointment: boolean;
  setGlobalError: any;
  setNeedAppointment?: any;
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
  options,
}: BookAppointmentFormProps): JSX.Element => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { currentState } = process;
  const formData = process.currentState.processData.formData as {
    appointmentDateTime: string;
  };
  return (
    <>
      <Formik
        initialValues={{ day: "", month: "", year: "", hour: "", minute: "", amPm: "" }}
        onSubmit={async (values) => {
          const appointmentDateTime = getAppointmentDateTime(values);
          let processTrigger = options.requestAppointmentTrigger;
          if (
            [
              options.appointmentRequestedState,
              options.appointmentRescheduledState,
            ].includes(currentState.state)
          ) {
            if (isPast(new Date(formData.appointmentDateTime))) {
              processTrigger = options.rescheduleAppointmentTrigger;
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
            setNeedAppointment(!needAppointment);
            mutate();
          } catch (e: any) {
            setGlobalError(e.response?.status || 500);
          }
        }}
        validateOnBlur
        validate={(values) => validate(values, setDisabled)}
      >
        {() => {
          return (
            needAppointment && (
              <Form
                noValidate
                id="request-appointment-form"
                className="request-appointment-form"
              >
                <DateTimeFields />
                <Button type="submit" disabled={disabled} style={{ width: 222 }}>
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

export const validate = (values, setDisabled) => {
  if (
    !values.day ||
    !values.month ||
    !values.year ||
    !values.hour ||
    !values.minute ||
    !values.amPm ||
    !["am", "pm"].includes(values.amPm.toLowerCase())
  ) {
    setDisabled(true);
    return;
  }
  if (
    !isFutureDate(dateToString(getAppointmentDateTime(values), "yyyy-MM-dd'T'HH:mm:ss"))
  ) {
    setDisabled(true);
    return;
  }
  setDisabled(false);
};

export const DateTimeFields = ({
  dateLabel = "Date",
  timeLabel = "Time",
}: {
  dateLabel?: string;
  timeLabel?: string;
}): JSX.Element => {
  return (
    <div style={{ display: "flex" }}>
      <DateField
        id="appointment-form-date"
        className="mtfh-appointment-form__date"
        label={dateLabel}
        dayLabel=""
        monthLabel=""
        yearLabel=""
        dayProps={{ name: "day", placeholder: "dd" }}
        monthProps={{ name: "month", placeholder: "mm" }}
        yearProps={{ name: "year", placeholder: "yy" }}
        style={{ marginTop: "1.5em", width: "100%" }}
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
        amPmProps={{ name: "amPm", placeholder: "am" }}
        style={{ marginTop: "1.5em", width: "100%" }}
        required
      />
    </div>
  );
};
