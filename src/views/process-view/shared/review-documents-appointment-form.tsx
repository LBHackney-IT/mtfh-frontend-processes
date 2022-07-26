import React, { useState } from "react";

import { AppointmentDetails, AppointmentForm } from "../../../components";
import { locale } from "../../../services";
import { Trigger } from "../../../services/processes/types";
import { IProcess } from "../../../types";
import { getPreviousState } from "../../../utils/processUtil";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { Checkbox } from "@mtfh/common/lib/components";

interface ReviewDocumentsAppointmentFormProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  setGlobalError: any;
  optional?: any;
}

export const ReviewDocumentsAppointmentForm = ({
  processConfig,
  process,
  mutate,
  setGlobalError,
  optional,
}: ReviewDocumentsAppointmentFormProps): JSX.Element => {
  const [needAppointment, setNeedAppointment] = useState<boolean>(false);

  const { states } = processConfig;
  const processState = [
    states.processCancelled.state,
    states.processClosed.state,
  ].includes(process.currentState.state)
    ? getPreviousState(process)
    : process.currentState;
  return (
    <>
      {[
        states.documentsRequestedAppointment.state,
        states.documentsAppointmentRescheduled.state,
      ].includes(processState.state) && (
        <AppointmentDetails
          currentState={processState}
          previousStates={process.previousStates}
          needAppointment={needAppointment}
          setNeedAppointment={setNeedAppointment}
          options={{
            requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
            rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
            appointmentRequestedState: states.documentsRequestedAppointment.state,
            appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
          }}
        />
      )}

      {((states.documentsRequestedDes.state === process.currentState.state &&
        !optional?.closeProcessReason) ||
        needAppointment) && (
        <Checkbox
          id="condition"
          checked={needAppointment}
          onChange={() => setNeedAppointment(!needAppointment)}
        >
          {locale.views.reviewDocuments.checkSupportingDocumentsAppointment}
        </Checkbox>
      )}

      {!optional?.closeProcessReason && (
        <AppointmentForm
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          needAppointment={needAppointment}
          setNeedAppointment={setNeedAppointment}
          options={{
            buttonText: locale.bookAppointment,
            requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
            rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
            appointmentRequestedState: states.documentsRequestedAppointment.state,
            appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
          }}
        />
      )}
    </>
  );
};
