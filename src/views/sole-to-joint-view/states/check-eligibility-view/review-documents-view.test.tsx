import React from "react";

import { patchProcessV1, render, server } from "@hackney/mtfh-test-utils";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../services";
import {
  mockDocumentsRequestedAppointment,
  mockDocumentsRequestedDes,
} from "../../../../test-utils";
import { ReviewDocumentsView } from "./review-documents-view";

describe("review-documents-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders ReviewDocuments correctly", async () => {
    render(
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

  test("it enables book appointment once change button is clicked", async () => {
    render(
      <ReviewDocumentsView
        processConfig={processes.soletojoint}
        process={mockDocumentsRequestedAppointment}
        mutate={() => {}}
      />,
    );

    await expect(screen.queryByText(locale.bookAppointment)).toBeNull();
    const changeButton = screen.getByText(locale.change);
    fireEvent.click(changeButton);
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
    const checkbox = screen.getByLabelText(
      locale.views.reviewDocuments.checkSupportingDocumentsAppointment,
    );
    fireEvent.click(checkbox);
    await typeDateTime(user, "2099");
    const bookAppointmentButton = await screen.findByText(locale.bookAppointment);
    expect(bookAppointmentButton).toBeEnabled();
    user.click(bookAppointmentButton);
    await expect(
      screen.findByText("There was a problem with completing the action"),
    ).resolves.toBeInTheDocument();
  });

  test("it enables next once checkbox is selected", async () => {
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
