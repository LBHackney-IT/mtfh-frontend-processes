import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { isPast } from "date-fns";

import { SoleToJointHeader } from "../../../../components";
import { AppointmentDetails } from "../../../../components/appointment-details/appointment-details";
import { AppointmentForm } from "../../../../components/appointment-form/appointment-form";
import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { IProcess } from "../../../../types";
import { EligibilityChecksPassedBox, TenantContactDetails } from "../shared";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Box,
  Button,
  Center,
  Checkbox,
  ErrorSummary,
  Heading,
  Link,
  Spinner,
  StatusErrorSummary,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";

const { views } = locale;

interface TenureInvestigationViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
}

export const TenureInvestigationView = ({
  processConfig,
  process,
  mutate,
}: TenureInvestigationViewProps): JSX.Element => {
  const isCurrentState = (state) => state === process.currentState.state;
  const [globalError, setGlobalError] = useState<number>();
  const [completed, setCompleted] = useState<boolean>(false);
  const { data: tenure, error } = useTenure(process.targetId);
  const {
    applicationSubmitted,
    hoApprovalPassed,
    tenureAppointmentScheduled,
    tenureAppointmentRescheduled,
  } = processConfig.states;
  const [needAppointment, setNeedAppointment] = useState<boolean>(
    isCurrentState(hoApprovalPassed.state),
  );
  const formData = process.currentState.processData.formData as {
    appointmentDateTime: string;
  };

  if (error) {
    return (
      <ErrorSummary
        id="tenure-investigation-view"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!tenure) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const stateConfig = processConfig.states.applicationSubmitted;
  const tenant = tenure?.householdMembers.find((m) => m.isResponsible);
  const submit = async (recommendation: string) => {
    try {
      await editProcess({
        id: process.id,
        processName: process?.processName,
        etag: process.etag || "",
        processTrigger: stateConfig.triggers.tenureInvestigation,
        formData: {
          tenureInvestigationRecommendation: recommendation,
        },
        documents: [],
      });
      mutate();
    } catch (e: any) {
      setGlobalError(e.response?.status || 500);
    }
  };

  return (
    <div data-testid="soletojoint-TenureInvestigation">
      <SoleToJointHeader processConfig={processConfig} process={process} />
      {globalError && (
        <StatusErrorSummary id="tenure-investigation-global-error" code={globalError} />
      )}
      <EligibilityChecksPassedBox />
      <Box variant="success">
        <StatusHeading
          variant="success"
          title={views.submitCase.supportingDocumentsApproved}
        />
        <div
          style={{ marginLeft: 60, marginTop: 17.5 }}
          className="govuk-link lbh-link lbh-link--no-visited-state"
        >
          <Link as={RouterLink} to="#" variant="link">
            {views.reviewDocuments.viewInDes}
          </Link>
        </div>
      </Box>
      {[
        hoApprovalPassed.state,
        tenureAppointmentScheduled.state,
        tenureAppointmentRescheduled.state,
      ].includes(process.currentState.state) && (
        <>
          {/*TODO*/}
          <Box variant="success">
            <StatusHeading
              variant="success"
              title={views.tenureInvestigation.tenureInvestigatorRecommendation(
                "approve",
              )}
            />
            <div
              style={{ marginLeft: 60, marginTop: 17.5 }}
              className="govuk-link lbh-link lbh-link--no-visited-state"
            >
              <Link as={RouterLink} to="#" variant="link">
                {views.tenureInvestigation.showReport}
              </Link>
            </div>
          </Box>
          {/*TODO*/}

          <Box variant="success">
            <StatusHeading
              variant="success"
              title={views.tenureInvestigation.hoApproved}
            />
          </Box>

          <Heading variant="h2">{views.tenureInvestigation.hoApprovedNextSteps}</Heading>
          {isCurrentState(hoApprovalPassed.state) && (
            <Text>{views.tenureInvestigation.mustMakeAppointment}</Text>
          )}

          {[
            tenureAppointmentScheduled.state,
            tenureAppointmentRescheduled.state,
          ].includes(process.currentState.state) && (
            <AppointmentDetails
              process={process}
              needAppointment={needAppointment}
              setNeedAppointment={setNeedAppointment}
              options={{
                requestAppointmentTrigger: Trigger.ScheduleTenureAppointment,
                rescheduleAppointmentTrigger: Trigger.RescheduleTenureAppointment,
                appointmentRequestedState: tenureAppointmentScheduled.state,
                appointmentRescheduledState: tenureAppointmentRescheduled.state,
                cancelProcess: true,
              }}
            />
          )}
        </>
      )}

      {tenant ? <TenantContactDetails tenant={tenant} /> : <Text>Tenant not found.</Text>}

      {[
        hoApprovalPassed.state,
        tenureAppointmentScheduled.state,
        tenureAppointmentRescheduled.state,
      ].includes(process.currentState.state) && (
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

      {[tenureAppointmentScheduled.state, tenureAppointmentRescheduled.state].includes(
        process.currentState.state,
      ) &&
        !needAppointment && (
          <Button disabled={!isPast(new Date(formData.appointmentDateTime))}>
            {views.tenureInvestigation.documentsSigned}
          </Button>
        )}

      {isCurrentState(applicationSubmitted.state) && (
        <>
          <Checkbox
            id="tenure-investigation-completed"
            checked={completed}
            onChange={() => setCompleted(!completed)}
          >
            {views.tenureInvestigation.tenureInvestigationCompleted}
          </Checkbox>
          <Text>{views.tenureInvestigation.recommendation}</Text>
          <Button
            type="submit"
            disabled={!completed}
            onClick={() => submit("approve")}
            style={{ width: 222, marginRight: "100%" }}
          >
            {views.tenureInvestigation.approve}
          </Button>
          <Button
            type="submit"
            disabled={!completed}
            onClick={() => submit("appointment")}
            style={{ width: 222, marginRight: "100%" }}
          >
            {views.tenureInvestigation.appointment}
          </Button>
          <Button
            type="submit"
            disabled={!completed}
            onClick={() => submit("decline")}
            style={{ width: 222, marginRight: "100%" }}
          >
            {views.tenureInvestigation.decline}
          </Button>
        </>
      )}
    </div>
  );
};
