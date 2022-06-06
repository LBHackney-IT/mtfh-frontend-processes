import React from "react";

import { patchProcessV1, render, server } from "@hackney/mtfh-test-utils";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../services";
import {
  mockDocumentsRequestedAppointment,
  mockDocumentsRequestedDes,
  mockDocumentsRequestedDesAppointment,
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
    await expect(screen.findByText(locale.closeCase)).resolves.toBeInTheDocument();
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
    const user = userEvent.setup();
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
    await typeDateTime(user, "2000");
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
    await typeDateTime(user, "2099");
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

  test("it displays an error if there's an issue with book appointment", async () => {
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
    await expect(screen.findByText(locale.closeCase)).resolves.toBeInTheDocument();
    await expect(screen.getByText(locale.next)).toBeDisabled();
    expect(container).toMatchSnapshot();
  });

  test("it displays close case dialog on close case button click and closes on cancel", async () => {
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
      />,
    );

    await userEvent.click(screen.getByText(locale.closeCase));
    await expect(
      screen.findByText(locale.views.closeCase.reasonForRejection, { exact: false }),
    ).resolves.toBeInTheDocument();
    await userEvent.click(await screen.findByText(locale.cancel));
    await expect(
      screen.queryByText(locale.views.closeCase.reasonForRejection),
    ).toBeNull();
  });

  test("it displays close case view with reason and checkbox to confirm", async () => {
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
      />,
    );
    const reason = "Documents not provided";
    await userEvent.click(await screen.findByText(locale.closeCase));
    await expect(
      screen.findByText(locale.views.closeCase.reasonForRejection),
    ).resolves.toBeInTheDocument();
    await userEvent.type(
      screen.getByLabelText(`${locale.views.closeCase.reasonForRejection}*`),
      reason,
    );
    await userEvent.click(await screen.findByText(locale.confirm));
    await expect(
      screen.findByText(locale.views.reviewDocuments.soleToJointClosed),
    ).resolves.toBeInTheDocument();
    await expect(screen.findByText(reason)).resolves.toBeInTheDocument();
  });

  test("it closes case when checkbox is ticked and reason provided", async () => {
    server.use(patchProcessV1({}, 200));
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
      />,
    );

    const reason = "Documents not provided";
    await userEvent.click(await screen.findByText(locale.closeCase));
    await userEvent.type(
      screen.getByLabelText(`${locale.views.closeCase.reasonForRejection}*`),
      reason,
    );
    await userEvent.click(await screen.findByText(locale.confirm));
    await expect(screen.findByText(reason)).resolves.toBeInTheDocument();
    await expect(screen.findByText(locale.confirm)).resolves.toBeDisabled();
    await userEvent.click(
      screen.getByLabelText(locale.views.reviewDocuments.outcomeLetterSent),
    );
    await expect(screen.findByText(locale.confirm)).resolves.toBeEnabled();
    await userEvent.click(screen.getByText(locale.confirm));
    expect(
      screen.findByText(locale.views.reviewDocuments.confirmation),
    ).resolves.toBeInTheDocument();
  });

  test("it displays error if close case API call fails", async () => {
    server.use(patchProcessV1("", 500));
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
      />,
    );

    const reason = "Documents not provided";
    await userEvent.click(await screen.findByText(locale.closeCase));
    await userEvent.type(
      screen.getByLabelText(`${locale.views.closeCase.reasonForRejection}*`),
      reason,
    );
    await userEvent.click(await screen.findByText(locale.confirm));
    await userEvent.click(
      screen.getByLabelText(locale.views.reviewDocuments.outcomeLetterSent),
    );
    await userEvent.click(screen.getByText(locale.confirm));
    await expect(
      screen.findByText("There was a problem with completing the action"),
    ).resolves.toBeInTheDocument();
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

async function typeDateTime(user, year) {
  await user.type(screen.getByPlaceholderText(/dd/i), "01");
  await user.type(screen.getByPlaceholderText(/mm/i), "01");
  await user.type(screen.getByPlaceholderText(/yy/i), year);
  await user.type(screen.getAllByPlaceholderText(/00/i)[0], "01");
  await user.type(screen.getAllByPlaceholderText(/00/i)[1], "01");
  await user.type(screen.getByPlaceholderText(/am/i), "am");
}
