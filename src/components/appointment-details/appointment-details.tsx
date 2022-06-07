import { format, isPast } from "date-fns";

import { locale } from "../../services";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { Box, LinkButton, StatusHeading, Text } from "@mtfh/common/lib/components";

interface AppointmentDetailsProps {
  process: Process;
  needAppointment: boolean;
  setNeedAppointment: any;
  options: {
    requestAppointmentTrigger: string;
    rescheduleAppointmentTrigger: string;
    appointmentRequestedState: string;
    appointmentRescheduledState: string;
    cancelProcess?: boolean;
  };
}

export const AppointmentDetails = ({
  process,
  needAppointment,
  setNeedAppointment,
  options,
}: AppointmentDetailsProps): JSX.Element => {
  const { currentState } = process;
  const formData = process.currentState.processData.formData as {
    appointmentDateTime: string;
  };

  return (
    <>
      {[options.appointmentRequestedState, options.appointmentRescheduledState].includes(
        currentState.state,
      ) && (
        <>
          {options.appointmentRescheduledState === process.currentState.state &&
            process.previousStates.map((process) => {
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
            <StatusHeading
              variant="base"
              title={locale.components.appointment.scheduled}
            />
            <Text style={{ marginLeft: 60 }}>
              Date: {format(new Date(formData.appointmentDateTime), "eeee do MMMM yyyy")}
              <br />
              Time: {format(new Date(formData.appointmentDateTime), "hh:mm aaa")}
            </Text>

            <LinkButton
              style={{ marginLeft: 60 }}
              onClick={() => setNeedAppointment(!needAppointment)}
            >
              {isPast(new Date(formData.appointmentDateTime))
                ? locale.reschedule
                : locale.change}
            </LinkButton>
            {options.cancelProcess &&
              options.appointmentRescheduledState === process.currentState.state &&
              isPast(new Date(formData.appointmentDateTime)) && (
                <LinkButton
                  style={{ marginLeft: 60 }}
                  onClick={() => setNeedAppointment(!needAppointment)}
                >
                  {locale.components.appointment.cancelProcess}
                </LinkButton>
              )}
          </Box>
        </>
      )}
    </>
  );
};
