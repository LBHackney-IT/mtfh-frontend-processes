import { format, isPast } from "date-fns";

import { locale } from "../../services";

import { ProcessState } from "@mtfh/common/lib/api/process/v1/types";
import { Box, LinkButton, StatusHeading, Text } from "@mtfh/common/lib/components";

interface AppointmentDetailsProps {
  currentState: ProcessState;
  previousStates: ProcessState[];
  needAppointment: boolean;
  setNeedAppointment: any;
  closeCase?: boolean;
  setCloseCase?: any;
  options: {
    requestAppointmentTrigger: string;
    rescheduleAppointmentTrigger: string;
    appointmentRequestedState: string;
    appointmentRescheduledState: string;
    closeCaseButton?: boolean;
  };
}

export const AppointmentDetails = ({
  currentState,
  previousStates,
  needAppointment,
  setNeedAppointment,
  closeCase = false,
  setCloseCase,
  options,
}: AppointmentDetailsProps): JSX.Element => {
  const formData = currentState.processData.formData as {
    appointmentDateTime: string;
  };

  return (
    <>
      {options.appointmentRescheduledState === currentState.state &&
        previousStates.map((process) => {
          if (process.state === options.appointmentRequestedState) {
            return (
              <Box key={process.state}>
                <StatusHeading
                  variant="base"
                  title={locale.components.appointment.missed}
                />
                <Text style={{ marginLeft: 60 }}>
                  Date:{" "}
                  {format(
                    new Date(process.processData.formData.appointmentDateTime),
                    "eeee do MMMM yyyy",
                  )}
                  <br />
                  Time:{" "}
                  {format(
                    new Date(process.processData.formData.appointmentDateTime),
                    "hh:mm aaa",
                  )}
                </Text>
              </Box>
            );
          }
          return null;
        })}

      <Box>
        <StatusHeading variant="base" title={locale.components.appointment.scheduled} />
        <Text style={{ marginLeft: 60 }}>
          Date: {format(new Date(formData.appointmentDateTime), "eeee do MMMM yyyy")}
          <br />
          Time: {format(new Date(formData.appointmentDateTime), "hh:mm aaa")}
        </Text>

        {!closeCase && (
          <>
            <LinkButton
              style={{ marginLeft: 60 }}
              onClick={() => setNeedAppointment(!needAppointment)}
            >
              {isPast(new Date(formData.appointmentDateTime))
                ? locale.reschedule
                : locale.change}
            </LinkButton>
            {options.closeCaseButton &&
              options.appointmentRescheduledState === currentState.state &&
              isPast(new Date(formData.appointmentDateTime)) && (
                <LinkButton style={{ marginLeft: 60 }} onClick={() => setCloseCase(true)}>
                  {locale.components.appointment.closeCase}
                </LinkButton>
              )}
          </>
        )}
      </Box>
    </>
  );
};
