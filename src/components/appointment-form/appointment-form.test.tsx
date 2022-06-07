import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { processes } from "../../services";
import { Trigger } from "../../services/processes/types";
import { mockDocumentsRequestedDes, typeDateTime } from "../../test-utils";
import { AppointmentForm } from "./appointment-form";

const setNeedAppointment = jest.fn();
describe("appointment-form-component", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders appointment form correctly", () => {
    const { states } = processes.soletojoint;
    const { container } = render(
      <AppointmentForm
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        needAppointment
        setGlobalError={() => {}}
        setNeedAppointment={setNeedAppointment}
        options={{
          buttonText: "Continue",
          requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
          appointmentRequestedState: states.documentsRequestedAppointment.state,
          appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
        }}
      />,
    );
    expect(screen.getByText("Continue")).toBeDisabled();
    expect(container).toMatchSnapshot();
  });

  test("it doesnt renders appointment form", () => {
    const { states } = processes.soletojoint;
    const { container } = render(
      <AppointmentForm
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        needAppointment={false}
        setGlobalError={() => {}}
        setNeedAppointment={setNeedAppointment}
        options={{
          buttonText: "Continue",
          requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
          appointmentRequestedState: states.documentsRequestedAppointment.state,
          appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  test("it enables/disables continue button if date is future/past", async () => {
    const { states } = processes.soletojoint;
    render(
      <AppointmentForm
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        needAppointment
        setGlobalError={() => {}}
        setNeedAppointment={setNeedAppointment}
        options={{
          buttonText: "Continue",
          requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
          appointmentRequestedState: states.documentsRequestedAppointment.state,
          appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
        }}
      />,
    );
    await typeDateTime(screen, userEvent, "2099");
    expect(screen.getByText("Continue")).toBeEnabled();
    await typeDateTime(screen, userEvent, "2000");
    expect(screen.getByText("Continue")).toBeDisabled();
  });
});
