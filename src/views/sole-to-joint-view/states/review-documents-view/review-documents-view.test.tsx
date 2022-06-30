import React from "react";

import { patchProcessV1, render, server } from "@hackney/mtfh-test-utils";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../services";
import {
  mockDocumentsRequestedAppointment,
  mockDocumentsRequestedDes,
  mockDocumentsRequestedDesAppointment,
  typeDateTime,
} from "../../../../test-utils";
import { ReviewDocumentsView } from "./review-documents-view";

describe("review-documents-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders ReviewDocuments correctly on state DocumentsRequestedDes", async () => {
    const { container } = render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText(locale.views.reviewDocuments.passedChecks),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.reviewDocuments.viewInDes),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.reviewDocuments.checkSupportingDocumentsAppointment),
    ).resolves.toBeInTheDocument();
    await expect(screen.getByText(locale.next)).toBeDisabled();
    expect(container).toMatchSnapshot();
  });

  test("it enables book appointment once checkbox is selected", async () => {
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
      />,
    );

    await expect(screen.queryByText(locale.bookAppointment)).toBeNull();
    const checkbox = screen.getByLabelText(
      locale.views.reviewDocuments.checkSupportingDocumentsAppointment,
    );
    fireEvent.click(checkbox);
    const bookAppointmentButton = await screen.findByText(locale.bookAppointment);
    expect(bookAppointmentButton).toBeDisabled();
  });

  test("it disables book appointment if date is not in future", async () => {
    server.use(patchProcessV1("error", 500));
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
      />,
    );
    const checkbox = screen.getByLabelText(
      locale.views.reviewDocuments.checkSupportingDocumentsAppointment,
    );
    fireEvent.click(checkbox);
    await typeDateTime(screen, userEvent, "2000");
    const bookAppointmentButton = await screen.findByText(locale.bookAppointment);
    expect(bookAppointmentButton).toBeDisabled();
  });

  test("it displays an error if there's an issue with book appointment", async () => {
    const user = userEvent.setup();
    server.use(patchProcessV1("error", 500));
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
      />,
    );

    await userEvent.click(
      screen.getByLabelText(
        locale.views.reviewDocuments.checkSupportingDocumentsAppointment,
      ),
    );
    await expect(screen.findByText("Date")).resolves.toBeInTheDocument();
    await expect(screen.findByText("Time")).resolves.toBeInTheDocument();
    await typeDateTime(screen, userEvent, "2099");
    const bookAppointmentButton = await screen.findByText(locale.bookAppointment);
    expect(bookAppointmentButton).toBeEnabled();
    await user.click(bookAppointmentButton);
    await expect(
      screen.findByText("There was a problem with completing the action"),
    ).resolves.toBeInTheDocument();
  });

  test("it renders requested via des and book appointment", async () => {
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDesAppointment}
        mutate={() => {}}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText(locale.views.reviewDocuments.passedChecks),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.reviewDocuments.viewInDes),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.components.appointment.scheduled),
    ).resolves.toBeInTheDocument();
  });

  test("it displays change button if date is future", async () => {
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedAppointment({
          appointmentDateTime: "2099-10-12T08:59:00.000Z",
        })}
        mutate={() => {}}
      />,
    );

    await expect(
      screen.findByText(locale.components.appointment.scheduled),
    ).resolves.toBeInTheDocument();
    await expect(screen.findByText(locale.change)).resolves.toBeInTheDocument();
  });

  test("it displays reschedule button if date is past", async () => {
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedAppointment({
          appointmentDateTime: "2010-10-12T08:59:00.000Z",
        })}
        mutate={() => {}}
      />,
    );

    await expect(screen.queryByText(locale.bookAppointment)).toBeNull();
    const button = screen.getByText(locale.reschedule);
    fireEvent.click(button);
    const bookAppointmentButton = await screen.findByText(locale.bookAppointment);
    expect(bookAppointmentButton).toBeDisabled();
  });

  test("it enables next once all checkboxes are selected", async () => {
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
      />,
    );

    const nextButton = await screen.findByText(locale.next);
    await expect(nextButton).toBeDisabled();
    selectAllCheckBoxes();
    await expect(nextButton).toBeEnabled();
  });

  test("it displays an error if there's an issue with confirm", async () => {
    server.use(patchProcessV1("error", 500));
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
      />,
    );

    const nextButton = await screen.findByText(locale.next);
    selectAllCheckBoxes();
    expect(nextButton).toBeEnabled();
    nextButton.click();
    await expect(
      screen.findByText("There was a problem with completing the action"),
    ).resolves.toBeInTheDocument();
  });

  test("it renders ReviewDocuments correctly on state DocumentsRequestedAppointment", async () => {
    const { container } = render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedAppointment({
          appointmentDateTime: "2099-10-12T08:59:00.000Z",
        })}
        mutate={() => {}}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText(locale.views.reviewDocuments.passedChecks),
    ).resolves.toBeInTheDocument();
    await expect(screen.queryByText(locale.views.reviewDocuments.viewInDes)).toBeNull();
    await expect(
      screen.findByText(locale.components.appointment.scheduled),
    ).resolves.toBeInTheDocument();
    await expect(screen.findByText(/08:59 am/)).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(/Monday 12th October 2099/),
    ).resolves.toBeInTheDocument();
    await expect(screen.getByText(locale.next)).toBeDisabled();
    expect(container).toMatchSnapshot();
  });
});

function selectAllCheckBoxes() {
  fireEvent.click(screen.getByLabelText(locale.views.reviewDocuments.seenPhotographicId));
  fireEvent.click(screen.getByLabelText(locale.views.reviewDocuments.seenSecondId));
  fireEvent.click(
    screen.getByLabelText(locale.views.reviewDocuments.seenProofOfRelationship),
  );
  fireEvent.click(
    screen.getByLabelText(locale.views.reviewDocuments.isNotInImmigrationControl),
  );
  fireEvent.click(
    screen.getByLabelText(locale.views.reviewDocuments.incomingTenantLivingInProperty),
  );
}
