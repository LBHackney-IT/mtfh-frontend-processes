import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { isPast } from "date-fns";

import {
  AppointmentDetails,
  AppointmentForm,
  CloseProcessView,
  ContactDetails,
} from "../../../../../components";
import { locale } from "../../../../../services";
import { Trigger } from "../../../../../services/processes/types";
import { IProcess } from "../../../../../types";
import { getPreviousState } from "../../../../../utils/processUtil";

import { Process } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Heading,
  Link,
  StatusBox,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";

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
  const {
    hoApprovalPassed,
    tenureAppointmentScheduled,
    tenureAppointmentRescheduled,
    tenureUpdated,
    processClosed,
    processCancelled,
  } = processConfig.states;
  const { currentState } = process;
  const [needAppointment, setNeedAppointment] = useState<boolean>(
    hoApprovalPassed.state === process.currentState.state,
  );
  const {
    closeCase,
    setCloseCase,
    tenant,
    closeProcessReason,
    documentsSigned,
    setDocumentsSigned,
  } = optional;

  const processState = [processClosed.state, processCancelled.state].includes(
    currentState.state,
  )
    ? getPreviousState(process)
    : currentState;

  const formData = processState.processData.formData as {
    appointmentDateTime: string;
  };

  const hoApprovalPassedState =
    currentState.state === hoApprovalPassed.state
      ? currentState
      : process.previousStates.find(
          (previous) => previous.state === hoApprovalPassed.state,
        );
  return (
    <>
      <StatusBox variant="success" title={views.hoReviewView.hoOutcome("approved")}>
        {hoApprovalPassedState?.processData.formData.reason && (
          <Text>{hoApprovalPassedState.processData.formData.reason}</Text>
        )}
      </StatusBox>

      {currentState.state === tenureUpdated.state ? (
        <Box variant="success">
          <StatusHeading
            variant="success"
            title={views.tenureInvestigation.tenancySigned}
          />
          <div
            style={{ marginLeft: 60, marginTop: 17.5 }}
            className="govuk-link lbh-link lbh-link--no-visited-state"
          >
            <Link
              as={RouterLink}
              to={`/tenure/${
                (process.relatedEntities as any[])?.find(
                  (entity) =>
                    entity.targetType === "tenure" && entity.subType === "newTenure",
                )?.id
              }`}
              variant="link"
            >
              {views.tenureInvestigation.viewNewTenure}
            </Link>
          </div>
        </Box>
      ) : (
        !closeProcessReason &&
        !closeCase &&
        ![processClosed.state, processCancelled.state].includes(currentState.state) && (
          <>
            {!documentsSigned && (
              <Heading variant="h2">
                {views.tenureInvestigation.hoApprovedNextSteps}
              </Heading>
            )}
            {![
              tenureAppointmentScheduled.state,
              tenureAppointmentRescheduled.state,
            ].includes(process.currentState.state) && (
              <Text>{views.tenureInvestigation.mustMakeAppointment}</Text>
            )}
          </>
        )
      )}

      {!documentsSigned &&
        [tenureAppointmentScheduled.state, tenureAppointmentRescheduled.state].includes(
          processState.state,
        ) && (
          <AppointmentDetails
            currentState={processState}
            previousStates={process.previousStates}
            needAppointment={needAppointment}
            setNeedAppointment={setNeedAppointment}
            closeCase={
              closeCase ||
              [processCancelled.state, processClosed.state].includes(currentState.state)
            }
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

      {!documentsSigned &&
        !closeCase &&
        !closeProcessReason &&
        ![processClosed.state, processCancelled.state, tenureUpdated.state].includes(
          currentState.state,
        ) &&
        tenant && <ContactDetails fullName={tenant.fullName} personId={tenant.id} />}

      {!closeProcessReason && (
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
      )}

      {!documentsSigned &&
        !closeCase &&
        [tenureAppointmentScheduled.state, tenureAppointmentRescheduled.state].includes(
          process.currentState.state,
        ) &&
        !needAppointment && (
          <Button
            disabled={!isPast(new Date(formData.appointmentDateTime))}
            onClick={() => setDocumentsSigned(true)}
          >
            {views.tenureInvestigation.documentsSigned}
          </Button>
        )}

      {(documentsSigned || currentState.state === tenureUpdated.state) && (
        <CloseProcessView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          statusBox={false}
          trigger={Trigger.UpdateTenure}
        />
      )}
    </>
  );
};
