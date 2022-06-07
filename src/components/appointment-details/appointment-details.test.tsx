import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale, processes } from "../../services";
import { Trigger } from "../../services/processes/types";
import {
  mockDocumentsAppointmentRescheduled,
  mockDocumentsRequestedAppointment,
} from "../../test-utils";
import { AppointmentDetails } from "./appointment-details";

const setNeedAppointment = jest.fn();
describe("appointment-details-component", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders scheduled appointment details correctly", () => {
    const { states } = processes.soletojoint;
    const { container } = render(
      <AppointmentDetails
        process={mockDocumentsRequestedAppointment({
          appointmentDateTime: "2099-10-12T08:59:00.000Z",
        })}
        needAppointment
        setNeedAppointment={setNeedAppointment}
        options={{
          requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
          appointmentRequestedState: states.documentsRequestedAppointment.state,
          appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
        }}
      />,
    );
    expect(screen.findByLabelText(locale.change)).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it renders scheduled but missed appointment details correctly", () => {
    const { states } = processes.soletojoint;
    render(
      <AppointmentDetails
        process={mockDocumentsRequestedAppointment({
          appointmentDateTime: "2010-10-12T08:59:00.000Z",
        })}
        needAppointment
        setNeedAppointment={setNeedAppointment}
        options={{
          requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
          appointmentRequestedState: states.documentsRequestedAppointment.state,
          appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
        }}
      />,
    );
    expect(screen.findByLabelText(locale.reschedule)).resolves.toBeInTheDocument();
  });

  test("it renders rescheduled appointment details correctly", () => {
    const { states } = processes.soletojoint;
    const { container } = render(
      <AppointmentDetails
        process={{
          ...mockDocumentsAppointmentRescheduled({
            appointmentDateTime: "2099-10-12T08:59:00.000Z",
          }),
          previousStates: [
            {
              state: "DocumentsRequestedAppointment",
              permittedTriggers: [],
              assignment: "",
              processData: {
                formData: {
                  appointmentDateTime: "2010-10-12T08:59:00.000Z",
                },
                documents: [],
              },
              createdAt: "",
              updatedAt: "",
            },
            {
              state: "BreachChecksPassed",
              permittedTriggers: [],
              assignment: "",
              processData: {
                formData: {},
                documents: [],
              },
              createdAt: "",
              updatedAt: "",
            },
          ],
        }}
        needAppointment
        setNeedAppointment={setNeedAppointment}
        options={{
          requestAppointmentTrigger: Trigger.RequestDocumentsAppointment,
          rescheduleAppointmentTrigger: Trigger.RescheduleDocumentsAppointment,
          appointmentRequestedState: states.documentsRequestedAppointment.state,
          appointmentRescheduledState: states.documentsAppointmentRescheduled.state,
        }}
      />,
    );
    expect(screen.findByLabelText(locale.change)).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
