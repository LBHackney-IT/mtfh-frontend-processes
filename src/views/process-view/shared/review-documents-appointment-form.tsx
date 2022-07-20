import React, { useState } from "react";

import { AppointmentDetails, AppointmentForm } from "../../../components";
import { locale } from "../../../services";
import { Trigger } from "../../../services/processes/types";
import { IProcess } from "../../../types";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { Checkbox } from "@mtfh/common/lib/components";

interface ReviewDocumentsAppointmentFormProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  setGlobalError: any;
}

export const ReviewDocumentsAppointmentForm = ({
  processConfig,
  process,
  mutate,
  setGlobalError,
}: ReviewDocumentsAppointmentFormProps): JSX.Element => {
  const [needAppointment, setNeedAppointment] = useState<boolean>(false);

  const { states } = processConfig;
  return (
    <>
      {[
        states.documentsRequestedAppointment.state,
        states.documentsAppointmentRescheduled.state,
      ].includes(process.currentState.state) && (
        <AppointmentDetails
          currentState={process.currentState}
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

      {(states.documentsRequestedDes.state === process.currentState.state ||
        needAppointment) && (
        <Checkbox
          id="condition"
          checked={needAppointment}
          onChange={() => setNeedAppointment(!needAppointment)}
        >
          {locale.views.reviewDocuments.checkSupportingDocumentsAppointment}
        </Checkbox>
      )}

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
    </>
  );
};
