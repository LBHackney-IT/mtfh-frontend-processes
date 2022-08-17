import React, { useState } from "react";

import { isPast } from "date-fns";

import {
  AppointmentDetails,
  AppointmentForm,
  CloseProcessView,
  ContactDetails,
} from "../../../../../components";
import { locale } from "../../../../../services";
import { Trigger } from "../../../../../services/processes/types";
import { IProcess, ProcessComponentProps } from "../../../../../types";
import { getPreviousState } from "../../../../../utils/processUtil";

import { Button, Checkbox, Heading, Text } from "@mtfh/common/lib/components";

interface NewTenancyViewProps extends ProcessComponentProps {
  processConfig: IProcess;
}

const { views } = locale;
export const NewTenancyView = ({
  processConfig,
  process,
  mutate,
  setGlobalError,
  optional,
}: NewTenancyViewProps): JSX.Element => {
  const {
    hoApprovalPassed,
    tenureAppointmentScheduled,
    tenureAppointmentRescheduled,
    nameUpdated,
    processClosed,
    processCancelled,
  } = processConfig.states;
  const { currentState } = process;
  const [needAppointment, setNeedAppointment] = useState<boolean>(
    hoApprovalPassed.state === process.currentState.state,
  );
  const [appointmentTrigger, setAppointmentTrigger] = useState<string>("");
  const {
    setCloseProcessDialogOpen,
    person,
    closeProcessReason,
    submitted,
    setSubmitted,
  } = optional;

  const isProcessClosed = [processClosed.state, processCancelled.state].includes(
    currentState.state,
  );

  const processState = isProcessClosed ? getPreviousState(process) : currentState;

  const formData = processState.processData.formData as {
    appointmentDateTime: string;
  };

  return (
    <div data-testid="changeofname-new-tenancy-view">
      {!closeProcessReason &&
        !isProcessClosed &&
        !submitted &&
        currentState.state !== nameUpdated.state && (
          <>
            <Heading variant="h2">
              {views.tenureInvestigation.hoApprovedNextSteps(
                locale.views.hoReviewModal[process.processName.toLowerCase()],
              )}
            </Heading>
            {![
              tenureAppointmentScheduled.state,
              tenureAppointmentRescheduled.state,
            ].includes(process.currentState.state) && (
              <Text>{views.tenureInvestigation.mustMakeAppointment}</Text>
            )}
          </>
        )}

      {!submitted &&
        [tenureAppointmentScheduled.state, tenureAppointmentRescheduled.state].includes(
          processState.state,
        ) && (
          <AppointmentDetails
            processConfig={processConfig}
            process={process}
            needAppointment={needAppointment}
            setNeedAppointment={setNeedAppointment}
            setAppointmentTrigger={setAppointmentTrigger}
            closeProcessReason={
              closeProcessReason ||
              [processCancelled.state, processClosed.state].includes(currentState.state)
            }
            setCloseProcessDialogOpen={setCloseProcessDialogOpen}
            options={{
              requestAppointmentTrigger: Trigger.ScheduleTenureAppointment,
              rescheduleAppointmentTrigger: Trigger.RescheduleTenureAppointment,
              appointmentRequestedState: tenureAppointmentScheduled.state,
              appointmentRescheduledState: tenureAppointmentRescheduled.state,
              closeCaseButton: true,
            }}
          />
        )}

      {!submitted &&
        !closeProcessReason &&
        !isProcessClosed &&
        currentState.state !== nameUpdated.state &&
        person && (
          <ContactDetails
            fullName={`${person.firstName} ${person.surname}`}
            personId={person.id}
          />
        )}

      {(![
        tenureAppointmentScheduled.state,
        tenureAppointmentRescheduled.state,
        nameUpdated.state,
      ].includes(currentState.state) ||
        needAppointment) &&
        !closeProcessReason &&
        !isProcessClosed &&
        !submitted && (
          <Checkbox
            id="condition"
            checked={needAppointment}
            onChange={() => setNeedAppointment(!needAppointment)}
          >
            {locale.views.newTenancy.appointmentSignCN7Form}
          </Checkbox>
        )}

      {!closeProcessReason && needAppointment && (
        <AppointmentForm
          process={process}
          mutate={mutate}
          needAppointment={needAppointment}
          setGlobalError={setGlobalError}
          setNeedAppointment={setNeedAppointment}
          appointmentTrigger={appointmentTrigger}
          options={{
            buttonText: "Continue",
            requestAppointmentTrigger: Trigger.ScheduleTenureAppointment,
            rescheduleAppointmentTrigger: Trigger.RescheduleTenureAppointment,
            appointmentRequestedState: tenureAppointmentScheduled.state,
            appointmentRescheduledState: tenureAppointmentRescheduled.state,
          }}
        />
      )}

      {!submitted &&
        !closeProcessReason &&
        [tenureAppointmentScheduled.state, tenureAppointmentRescheduled.state].includes(
          process.currentState.state,
        ) &&
        !needAppointment && (
          <Button
            disabled={!isPast(new Date(formData.appointmentDateTime))}
            onClick={() => setSubmitted(true)}
          >
            {views.tenureInvestigation.documentsSigned}
          </Button>
        )}

      {(submitted || currentState.state === nameUpdated.state) && (
        <CloseProcessView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          statusBox={false}
          trigger={Trigger.UpdateName}
        />
      )}
    </div>
  );
};
