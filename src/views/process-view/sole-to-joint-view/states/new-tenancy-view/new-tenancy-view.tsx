import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { isPast } from "date-fns";

import {
  AppointmentDetails,
  AppointmentForm,
  CloseProcessView,
  ContactDetails,
} from "../../../../../components";
import { TenureUpdateForm } from "../../../../../components/tenure-update-form";
import { locale } from "../../../../../services";
import { Trigger } from "../../../../../services/processes/types";
import { IProcess } from "../../../../../types";
import { reformatDate } from "../../../../../utils/date";
import { findStateInProcess, getPreviousState } from "../../../../../utils/processUtil";

import { Process } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Checkbox,
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
    processCompleted,
  } = processConfig.states;
  const { currentState } = process;
  const [needAppointment, setNeedAppointment] = useState<boolean>(
    hoApprovalPassed.state === process.currentState.state,
  );
  const [appointmentTrigger, setAppointmentTrigger] = useState<string>("");

  const {
    setCloseProcessDialogOpen,
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
      : findStateInProcess(process, hoApprovalPassed.state);

  const tenureUpdatedStateData = findStateInProcess(process, tenureUpdated.state);
  const tenureStartDate = tenureUpdatedStateData
    ? reformatDate(
        tenureUpdatedStateData.processData.formData.tenureStartDate,
        "yyyy-MM-dd",
        "dd/MM/yyyy",
      )
    : undefined;

  const [isDocumentsSignedDisabled, setDocumentsSignedDisabled] = useState<boolean>(
    !isPast(new Date(formData.appointmentDateTime)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDocumentsSignedDisabled(!isPast(new Date(formData.appointmentDateTime)));
    }, 1000);
    return () => clearInterval(interval);
  }, [isDocumentsSignedDisabled, formData.appointmentDateTime]);

  return (
    <>
      <StatusBox variant="success" title={views.hoReviewView.hoOutcome("Approve")}>
        {hoApprovalPassedState?.processData.formData.reason && (
          <Text>{hoApprovalPassedState.processData.formData.reason}</Text>
        )}
      </StatusBox>
      <StatusBox variant="success" title={views.hoReviewView.soleToJointApproved} />

      {tenureStartDate ? (
        <Box variant="success">
          <StatusHeading
            variant="success"
            title={views.tenureInvestigation.getTenancySigned(tenureStartDate)}
          />
          <Text
            style={{ marginLeft: 60, marginTop: 8 }}
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
          </Text>
        </Box>
      ) : (
        !closeProcessReason &&
        ![processClosed.state, processCancelled.state].includes(currentState.state) && (
          <>
            {!documentsSigned && (
              <Heading variant="h2">
                {views.tenureInvestigation.hoApprovedNextSteps(
                  locale.views.hoReviewModal[process.processName.toLowerCase()],
                )}
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

      {!documentsSigned &&
        !closeProcessReason &&
        ![
          processClosed.state,
          processCancelled.state,
          tenureUpdated.state,
          processCompleted.state,
        ].includes(currentState.state) &&
        tenant && <ContactDetails fullName={tenant.fullName} personId={tenant.id} />}

      {(![
        tenureAppointmentScheduled.state,
        tenureAppointmentRescheduled.state,
        processClosed.state,
        processCancelled.state,
        tenureUpdated.state,
        processCompleted.state,
      ].includes(currentState.state) ||
        needAppointment) && (
        <Checkbox
          id="condition"
          checked={needAppointment}
          onChange={() => setNeedAppointment(!needAppointment)}
        >
          {locale.views.reviewDocuments.checkSupportingDocumentsAppointment}
        </Checkbox>
      )}

      {!closeProcessReason && (
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

      {!documentsSigned &&
        !closeProcessReason &&
        [tenureAppointmentScheduled.state, tenureAppointmentRescheduled.state].includes(
          process.currentState.state,
        ) &&
        !needAppointment && (
          <Button
            disabled={isDocumentsSignedDisabled}
            onClick={() =>
              setDocumentsSigned(isPast(new Date(formData.appointmentDateTime)) && true)
            }
          >
            {views.tenureInvestigation.documentsSigned}
          </Button>
        )}

      {documentsSigned &&
        [tenureAppointmentScheduled.state, tenureAppointmentRescheduled.state].includes(
          currentState.state,
        ) && (
          <TenureUpdateForm
            process={process}
            mutate={mutate}
            setGlobalError={setGlobalError}
          />
        )}

      {[tenureUpdated.state, processCompleted.state].includes(currentState.state) && (
        <CloseProcessView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          statusBox={false}
          trigger={Trigger.CompleteProcess}
          nextStepsLabel={locale.finalStep}
        />
      )}
    </>
  );
};
