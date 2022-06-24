import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { isPast } from "date-fns";

import { AppointmentDetails } from "../../../../components/appointment-details/appointment-details";
import { AppointmentForm } from "../../../../components/appointment-form/appointment-form";
import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { IProcess } from "../../../../types";
import { CloseProcessView } from "../close-process-view";

import { Process } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Heading,
  Link,
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
  const { hoApprovalPassed, tenureAppointmentScheduled, tenureAppointmentRescheduled } =
    processConfig.states;
  const { currentState } = process;
  const [needAppointment, setNeedAppointment] = useState<boolean>(
    hoApprovalPassed.state === process.currentState.state,
  );
  const { closeCase, setCloseCase } = optional;
  const { documentsSigned, setDocumentsSigned } = optional;
  const formData = process.currentState.processData.formData as {
    appointmentDateTime: string;
  };
  return (
    <>
      <Box variant="success">
        <StatusHeading
          variant="success"
          title={views.hoReviewView.hoOutcome("approved")}
        />
      </Box>

      {documentsSigned ? (
        <Box variant="success">
          <StatusHeading
            variant="success"
            title={views.tenureInvestigation.tenancySigned}
          />
          <div
            style={{ marginLeft: 60, marginTop: 17.5 }}
            className="govuk-link lbh-link lbh-link--no-visited-state"
          >
            <Link as={RouterLink} to={`/tenure/${process.targetId}`} variant="link">
              {views.tenureInvestigation.viewNewTenure}
            </Link>
          </div>
        </Box>
      ) : (
        <>
          <Heading variant="h2">{views.tenureInvestigation.hoApprovedNextSteps}</Heading>
          {currentState.state === process.currentState.state && (
            <Text>{views.tenureInvestigation.mustMakeAppointment}</Text>
          )}
        </>
      )}

      {!documentsSigned &&
        [tenureAppointmentScheduled.state, tenureAppointmentRescheduled.state].includes(
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

      {documentsSigned && (
        <CloseProcessView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          optional={{
            trigger: Trigger.UpdateTenure,
            nextStepsDescription: false,
          }}
        />
      )}
    </>
  );
};
