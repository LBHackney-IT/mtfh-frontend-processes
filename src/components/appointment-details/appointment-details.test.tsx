import React from "react";

import { mockProcessV1, render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../services";
import { Trigger } from "../../services/processes/types";
import {
  mockDocumentsAppointmentRescheduled,
  mockDocumentsRequestedAppointment,
} from "../../test-utils";
import { AppointmentDetails } from "./appointment-details";

const { states } = processes.soletojoint;

const options = {
  requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
  rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
  appointmentRequestedState: states.documentsRequestedAppointment.state,
  appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
};

const setNeedAppointment = jest.fn();
describe("appointment-details-component", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders scheduled appointment details correctly", async () => {
    const process = mockDocumentsRequestedAppointment({
      appointmentDateTime: "2099-10-12T08:59:00.000Z",
    });
    const { container } = render(
      <AppointmentDetails
        processConfig={processes.soletojoint}
        process={process}
        needAppointment={false}
        setNeedAppointment={setNeedAppointment}
        setAppointmentTrigger={() => {}}
        options={options}
      />,
    );
    await expect(screen.findByText(locale.change)).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it renders scheduled but missed appointment details correctly", async () => {
    const process = mockDocumentsRequestedAppointment({
      appointmentDateTime: "2010-10-12T08:59:00.000Z",
    });
    render(
      <AppointmentDetails
        processConfig={processes.soletojoint}
        process={process}
        needAppointment={false}
        setNeedAppointment={setNeedAppointment}
        setAppointmentTrigger={() => {}}
        options={options}
      />,
    );
    await expect(screen.findByText(locale.reschedule)).resolves.toBeInTheDocument();
  });

  test("it renders rescheduled appointment details correctly", async () => {
    const process = {
      ...mockDocumentsAppointmentRescheduled({
        appointmentDateTime: "2099-10-12T08:59:00.000Z",
      }),
      previousStates: [
        {
          ...mockProcessV1.currentState,
          state: "DocumentsRequestedAppointment",
          processData: {
            formData: {
              appointmentDateTime: "2010-10-12T08:59:00.000Z",
            },
            documents: [],
          },
        },
        {
          ...mockProcessV1.currentState,
          state: "BreachChecksPassed",
        },
      ],
    };
    const { container } = render(
      <AppointmentDetails
        processConfig={processes.soletojoint}
        process={process}
        needAppointment={false}
        setNeedAppointment={setNeedAppointment}
        setAppointmentTrigger={() => {}}
        options={options}
      />,
    );
    await expect(screen.findByText(locale.change)).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it renders rescheduled appointment details with cancel process correctly", async () => {
    const setCloseProcessDialogOpen = jest.fn();
    const process = {
      ...mockDocumentsAppointmentRescheduled({
        appointmentDateTime: "2010-10-17T08:59:00.000Z",
      }),
      previousStates: [
        {
          ...mockProcessV1.currentState,
          state: "DocumentsRequestedAppointment",
          processData: {
            formData: {
              appointmentDateTime: "2010-10-12T08:59:00.000Z",
            },
            documents: [],
          },
        },
        {
          ...mockProcessV1.currentState,
          state: "BreachChecksPassed",
        },
      ],
    };
    render(
      <AppointmentDetails
        processConfig={processes.soletojoint}
        process={process}
        needAppointment={false}
        setNeedAppointment={setNeedAppointment}
        setAppointmentTrigger={() => {}}
        setCloseProcessDialogOpen={setCloseProcessDialogOpen}
        options={{
          ...options,
          closeCaseButton: true,
        }}
      />,
    );
    await userEvent.click(
      screen.getByText(locale.components.appointment.missedCloseCase),
    );
    expect(setCloseProcessDialogOpen.mock.calls.length).toBe(1);
  });
});
