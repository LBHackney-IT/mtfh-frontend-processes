import React from "react";

import { getReferenceDataV1, render, server } from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { processes } from "../../services";
import { Trigger } from "../../services/processes/types";
import { mockDocumentsRequestedDes } from "../../test-utils";
import { AppointmentForm } from "./appointment-form";

const setNeedAppointment = jest.fn();
describe("appointment-form-component", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders appointment form correctly", async () => {
    server.use(getReferenceDataV1({}, 200));
    const { states } = processes.soletojoint;
    const { container } = render(
      <AppointmentForm
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        needAppointment
        setGlobalError={() => {}}
        setNeedAppointment={setNeedAppointment}
        appointmentTrigger=""
        options={{
          buttonText: "Continue",
          requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
          appointmentRequestedState: states.documentsRequestedAppointment.state,
          appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
        }}
      />,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    expect(container).toMatchSnapshot();
    expect(screen.getByText("Continue")).toBeDisabled();
    await userEvent.type(screen.getByPlaceholderText(/yyyy/i), "2000");
    expect(screen.getByText("Continue")).toBeEnabled();
  });

  test("it doesnt render appointment form", async () => {
    server.use(getReferenceDataV1({}, 200));
    const { states } = processes.soletojoint;
    const { container } = render(
      <AppointmentForm
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        needAppointment={false}
        setGlobalError={() => {}}
        setNeedAppointment={setNeedAppointment}
        appointmentTrigger=""
        options={{
          buttonText: "Continue",
          requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
          appointmentRequestedState: states.documentsRequestedAppointment.state,
          appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
        }}
      />,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    expect(container).toMatchSnapshot();
  });
});
