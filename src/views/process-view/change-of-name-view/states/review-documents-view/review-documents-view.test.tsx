import React from "react";

import {
  getReferenceDataV1,
  mockPersonV1,
  mockProcessV1,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../../services";
import {
  mockDocumentsRequestedAppointment,
  mockDocumentsRequestedDes,
  mockDocumentsRequestedDesAppointment,
  typeDateTime,
} from "../../../../../test-utils";
import { ChangeOfNameView } from "../../change-of-name-view";
import { ReviewDocumentsView } from "./review-documents-view";

import * as errorMessages from "@mtfh/common/lib/hooks/use-error-codes";

const options = {
  url: "/processes/changeofname/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/:processName/:processId",
};

describe("review-documents-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders ReviewDocuments correctly on state DocumentsRequestedDes", async () => {
    jest.spyOn(errorMessages, "useErrorCodes").mockReturnValue({});
    const { container } = render(
      <ChangeOfNameView
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        optional={{}}
      />,
      options,
    );
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
    server.use(getReferenceDataV1({}, 200));
    render(
      <ReviewDocumentsView
        processConfig={processes.changeofname}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        setGlobalError={() => {}}
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

  test("it enable book appointment button if date is typed in", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(patchProcessV1("error", 500));
    render(
      <ReviewDocumentsView
        processConfig={processes.changeofname}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        setGlobalError={() => {}}
      />,
    );
    const checkbox = screen.getByLabelText(
      locale.views.reviewDocuments.checkSupportingDocumentsAppointment,
    );
    await userEvent.click(checkbox);
    await typeDateTime(screen, userEvent, "2000");
    await userEvent.click(screen.getByText(locale.bookAppointment));
    await expect(screen.findByText(locale.bookAppointment)).resolves.toBeEnabled();
  });

  test("it displays an error if there's an issue with book appointment", async () => {
    const user = userEvent.setup();
    server.use(patchProcessV1("error", 500));
    server.use(getReferenceDataV1({}, 200));
    render(
      <ChangeOfNameView
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        optional={{}}
      />,
    );
    await expect(
      screen.findByText(locale.views.reviewDocuments.checkSupportingDocumentsAppointment),
    ).resolves.toBeInTheDocument();
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
      <ChangeOfNameView
        process={mockDocumentsRequestedDesAppointment}
        mutate={() => {}}
        optional={{}}
      />,
      options,
    );
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
        processConfig={processes.changeofname}
        process={mockDocumentsRequestedAppointment({
          appointmentDateTime: "2099-10-12T08:59:00.000Z",
        })}
        mutate={() => {}}
        setGlobalError={() => {}}
      />,
    );

    await expect(
      screen.findByText(locale.components.appointment.scheduled),
    ).resolves.toBeInTheDocument();
    await expect(screen.findByText(locale.change)).resolves.toBeInTheDocument();
  });

  test("it displays reschedule button if date is past", async () => {
    server.use(getReferenceDataV1({}, 200));
    render(
      <ReviewDocumentsView
        processConfig={processes.changeofname}
        process={mockDocumentsRequestedAppointment({
          appointmentDateTime: "2010-10-12T08:59:00.000Z",
        })}
        mutate={() => {}}
        setGlobalError={() => {}}
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
        processConfig={processes.changeofname}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        setGlobalError={() => {}}
      />,
    );

    const nextButton = await screen.findByText(locale.next);
    await expect(nextButton).toBeDisabled();
    await selectAllCheckBoxes();
    await expect(nextButton).toBeEnabled();
  });

  test("it displays an error if there's an issue with confirm", async () => {
    server.use(patchProcessV1("error", 500));
    render(
      <ChangeOfNameView
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        optional={{}}
      />,
    );
    await expect(screen.findByText(locale.next)).resolves.toBeInTheDocument();
    const nextButton = screen.getByText(locale.next);
    await selectAllCheckBoxes();
    expect(nextButton).toBeEnabled();
    await userEvent.click(nextButton);
    await expect(
      screen.findByText("There was a problem with completing the action"),
    ).resolves.toBeInTheDocument();
  });

  test("it renders ReviewDocuments correctly on state DocumentsRequestedAppointment", async () => {
    jest.spyOn(errorMessages, "useErrorCodes").mockReturnValue({});
    const { container } = render(
      <ReviewDocumentsView
        processConfig={processes.changeofname}
        process={mockDocumentsRequestedAppointment({
          appointmentDateTime: "2099-10-12T08:59:00.000Z",
        })}
        mutate={() => {}}
        setGlobalError={() => {}}
      />,
      options,
    );
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

  test("it renders ReviewDocuments correctly on state=ProcessClosed and previousState=DocumentsRequestedDes", async () => {
    jest.spyOn(errorMessages, "useErrorCodes").mockReturnValue({});
    const { container } = render(
      <ChangeOfNameView
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ProcessCancelled" },
          previousStates: [
            { ...mockProcessV1.currentState, state: "DocumentsRequestedDes" },
          ],
        }}
        mutate={() => {}}
        optional={{
          person: mockPersonV1,
          closeProcessReason: "Test",
        }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.views.reviewDocuments.viewInDes),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it renders ReviewDocuments correctly on state=ProcessClosed and previousState=DocumentsRequestedAppointment", async () => {
    jest.spyOn(errorMessages, "useErrorCodes").mockReturnValue({});
    const { container } = render(
      <ChangeOfNameView
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ProcessCancelled" },
          previousStates: [
            {
              ...mockProcessV1.currentState,
              state: "DocumentsRequestedAppointment",
              processData: {
                formData: {
                  appointmentDateTime: "2099-10-12T08:59:00.000Z",
                },
                documents: [],
              },
            },
          ],
        }}
        mutate={() => {}}
        optional={{
          person: mockPersonV1,
          closeProcessReason: "Test",
        }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.components.appointment.scheduled),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

async function selectAllCheckBoxes() {
  await userEvent.click(
    screen.getByLabelText(locale.views.reviewDocuments.seenPhotographicId),
  );
  await userEvent.click(screen.getByLabelText(locale.views.reviewDocuments.seenSecondId));
  await userEvent.click(
    screen.getByLabelText(locale.views.reviewDocuments.atLeastOneDocument, {
      exact: false,
    }),
  );
}
