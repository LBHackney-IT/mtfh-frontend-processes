import { useMemo, useState } from "react";

import { format, isPast } from "date-fns";

import { locale } from "../../services";
import { IProcess } from "../../types";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { ProcessState } from "@mtfh/common/lib/api/process/v1/types";
import { LinkButton, StatusBox, Text } from "@mtfh/common/lib/components";

interface AppointmentDetailsProps {
  processConfig: IProcess;
  process: Process;
  needAppointment: boolean;
  setNeedAppointment: any;
  setAppointmentTrigger: any;
  closeProcessReason?: boolean;
  setCloseProcessDialogOpen?: any;
  options: {
    requestAppointmentTrigger: string;
    rescheduleAppointmentTrigger: string;
    appointmentRequestedState: string;
    appointmentRescheduledState: string;
    closeCaseButton?: boolean;
  };
}

export const AppointmentDetails = ({
  processConfig,
  process,
  needAppointment,
  setNeedAppointment,
  setAppointmentTrigger,
  closeProcessReason,
  setCloseProcessDialogOpen,
  options,
}: AppointmentDetailsProps): JSX.Element => {
  const { processClosed, processCancelled } = processConfig.states;
  const [isReschedule, setReschedule] = useState<boolean>(false);
  const [isMissed, setMissed] = useState<boolean>(false);
  const [statusTitle, setStatusTitle] = useState<string>(
    locale.components.appointment.scheduled,
  );

  useMemo(() => {
    if (isReschedule && needAppointment) {
      setStatusTitle(locale.components.appointment.notHappened);
    } else if ((isMissed && needAppointment) || closeProcessReason) {
      setStatusTitle(locale.components.appointment.missed);
    } else {
      setReschedule(false);
      setMissed(false);
      setStatusTitle(locale.components.appointment.scheduled);
    }
  }, [isReschedule, isMissed, needAppointment, closeProcessReason]);

  const isAppointmentState = (state) =>
    [options.appointmentRequestedState, options.appointmentRescheduledState].includes(
      state,
    );

  const scheduledAppointment = isAppointmentState(process.currentState.state)
    ? process.currentState
    : null;
  let missedAppointments: ProcessState[] = [];

  if (
    [processClosed.state, processCancelled.state].includes(process.currentState.state)
  ) {
    missedAppointments = process.previousStates
      .filter((previousState) => isAppointmentState(previousState.state))
      .slice(-2);
  }

  if (isAppointmentState(process.currentState.state)) {
    const previousStatesReversed = [...process.previousStates].reverse();
    const lastMissedAppointment = previousStatesReversed.find((previousState) =>
      isAppointmentState(previousState.state),
    );
    if (lastMissedAppointment) {
      missedAppointments = [lastMissedAppointment];
    }
  }

  return (
    <>
      {missedAppointments.map((missedAppointment) => {
        return (
          <StatusBox
            key={missedAppointment.state}
            title={locale.components.appointment.missed}
          >
            <DateTimeText
              appointmentDateTime={
                missedAppointment.processData.formData.appointmentDateTime
              }
            />
          </StatusBox>
        );
      })}

      {scheduledAppointment && (
        <StatusBox title={statusTitle}>
          <DateTimeText
            appointmentDateTime={
              scheduledAppointment.processData.formData.appointmentDateTime
            }
          />

          {!closeProcessReason && !isReschedule && !isMissed && !needAppointment && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginTop: 15,
              }}
            >
              <LinkButton
                onClick={() => {
                  setNeedAppointment(true);
                  setReschedule(
                    isPast(
                      new Date(
                        scheduledAppointment.processData.formData.appointmentDateTime,
                      ),
                    ),
                  );
                  setAppointmentTrigger("");
                }}
              >
                {isPast(
                  new Date(scheduledAppointment.processData.formData.appointmentDateTime),
                )
                  ? locale.reschedule
                  : locale.change}
              </LinkButton>

              {options.appointmentRescheduledState !== scheduledAppointment.state &&
                isPast(
                  new Date(scheduledAppointment.processData.formData.appointmentDateTime),
                ) &&
                missedAppointments.length === 0 && (
                  <LinkButton
                    style={{ marginTop: 15, textAlign: "start" }}
                    onClick={() => {
                      setNeedAppointment(true);
                      setMissed(true);
                      setAppointmentTrigger(options.rescheduleAppointmentTrigger);
                    }}
                  >
                    {locale.components.appointment.missedReschedule}
                  </LinkButton>
                )}

              {options.appointmentRescheduledState === scheduledAppointment.state &&
                isPast(
                  new Date(scheduledAppointment.processData.formData.appointmentDateTime),
                ) && (
                  <LinkButton
                    style={{ marginTop: 15, textAlign: "start" }}
                    onClick={() => {
                      setCloseProcessDialogOpen(true);
                      setMissed(true);
                    }}
                  >
                    {locale.components.appointment.missedCloseCase}
                  </LinkButton>
                )}
            </div>
          )}
        </StatusBox>
      )}
    </>
  );
};

const DateTimeText = ({ appointmentDateTime }) => {
  return (
    <Text style={{ marginTop: 15 }}>
      Date: {format(new Date(appointmentDateTime), "eeee do MMMM yyyy")}
      <br />
      Time: {format(new Date(appointmentDateTime), "hh:mm aaa")}
    </Text>
  );
};
