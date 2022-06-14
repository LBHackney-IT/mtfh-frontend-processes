import React, { useState } from "react";

import { isPast } from "date-fns";

import { AppointmentDetails } from "../../../../components/appointment-details/appointment-details";
import { AppointmentForm } from "../../../../components/appointment-form/appointment-form";
import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { IProcess } from "../../../../types";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import { Box, Button, Heading, StatusHeading, Text } from "@mtfh/common/lib/components";

interface NewTenancyViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  setGlobalError: any;
  optional?: any;
}
const { views } = locale;
export const NewTenancyView = ({
  processConfig,
  process,
  mutate,
  setGlobalError,
  optional,
}: NewTenancyViewProps): JSX.Element => {
  const { hoApprovalPassed, tenureAppointmentScheduled, tenureAppointmentRescheduled } =
    processConfig.states;
  const { currentState } = process;
  const [needAppointment, setNeedAppointment] = useState<boolean>(
    hoApprovalPassed.state === process.currentState.state,
  );
  const { closeCase, setCloseCase } = optional;
  const formData = process.currentState.processData.formData as {
    appointmentDateTime: string;
  };
  return (
    <>
      <Box variant="success">
        <StatusHeading variant="success" title={views.tenureInvestigation.hoApproved} />
      </Box>

      <Heading variant="h2">{views.tenureInvestigation.hoApprovedNextSteps}</Heading>
      {currentState.state === process.currentState.state && (
        <Text>{views.tenureInvestigation.mustMakeAppointment}</Text>
      )}

      {[tenureAppointmentScheduled.state, tenureAppointmentRescheduled.state].includes(
        process.currentState.state,
      ) && (
        <AppointmentDetails
          process={process}
          needAppointment={needAppointment}
          setNeedAppointment={setNeedAppointment}
          closeCase={closeCase}
          setCloseCase={setCloseCase}
          options={{
            requestAppointmentTrigger: Trigger.ScheduleTenureAppointment,
            rescheduleAppointmentTrigger: Trigger.RescheduleTenureAppointment,
            appointmentRequestedState: tenureAppointmentScheduled.state,
            appointmentRescheduledState: tenureAppointmentRescheduled.state,
            closeCaseButton: true,
          }}
        />
      )}

      <AppointmentForm
        process={process}
        mutate={mutate}
        needAppointment={needAppointment}
        setGlobalError={setGlobalError}
        setNeedAppointment={setNeedAppointment}
        options={{
          buttonText: "Continue",
          requestAppointmentTrigger: Trigger.ScheduleTenureAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleTenureAppointment,
          appointmentRequestedState: tenureAppointmentScheduled.state,
          appointmentRescheduledState: tenureAppointmentRescheduled.state,
        }}
      />

      {!closeCase &&
        [tenureAppointmentScheduled.state, tenureAppointmentRescheduled.state].includes(
          process.currentState.state,
        ) &&
        !needAppointment && (
          <Button
            disabled={!isPast(new Date(formData.appointmentDateTime))}
            onClick={async () => {
              try {
                await editProcess({
                  id: process.id,
                  processName: process?.processName,
                  etag: process.etag || "",
                  processTrigger:
                    processConfig.states[currentState.state].triggers.updateTenure,
                  formData: {},
                  documents: [],
                });
                mutate();
              } catch (e: any) {
                setGlobalError(e.response?.status || 500);
              }
            }}
          >
            {views.tenureInvestigation.documentsSigned}
          </Button>
        )}
    </>
  );
};
