import {
  getContactDetailsV2,
  getReferenceDataV1,
  mockContactDetailsV2,
  mockPersonV1,
  mockProcessV1,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../../services";
import { ChangeOfNameView } from "../../change-of-name-view";
import { NewTenancyView } from "./new-tenancy-view";

let submitted = false;
const setSubmitted = jest.fn();

const options = {
  url: "/processes/changeofname/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/:processName/:processId",
};

const mockTenureAppointmentSchedule = (appointmentDateTime) => {
  return {
    ...mockProcessV1,
    currentState: {
      ...mockProcessV1.currentState,
      processData: {
        formData: {
          appointmentDateTime,
        },
        documents: [],
      },
      state: "TenureAppointmentScheduled",
    },
  };
};

describe("tenure-investigation-view", () => {
  beforeEach(() => {
    jest.resetModules();
    submitted = false;
  });

  test("it renders NewTenancy view correctly for state=HOApprovalPassed", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <NewTenancyView
        processConfig={processes.changeofname}
        process={{
          ...mockProcessV1,
          processName: "changeofname",
          currentState: {
            ...mockProcessV1.currentState,
            state: "HOApprovalPassed",
          },
        }}
        mutate={() => {}}
        optional={{
          submitted,
          setSubmitted,
          person: mockPersonV1,
        }}
      />,
      options,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    expect(container).toMatchSnapshot();
    const appointmentCheckbox = screen.getByText(
      locale.views.reviewDocuments.checkSupportingDocumentsAppointment,
    );
    await userEvent.click(appointmentCheckbox);
    expect(screen.queryByText("Continue")).not.toBeInTheDocument();
  });

  test("it renders NewTenancy view correctly for state=HOApprovalPassed and closeProcessReason provided", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <NewTenancyView
        processConfig={processes.changeofname}
        process={{
          ...mockProcessV1,
          processName: "changeofname",
          currentState: {
            ...mockProcessV1.currentState,
            state: "HOApprovalPassed",
          },
        }}
        mutate={() => {}}
        optional={{
          submitted,
          setSubmitted,
          person: mockPersonV1,
          closeProcessReason: "Test",
        }}
      />,
      options,
    );
    expect(container).toMatchSnapshot();
  });

  test("it renders NewTenancy view correctly for state=TenureAppointmentScheduled", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <NewTenancyView
        processConfig={processes.changeofname}
        process={{
          ...mockTenureAppointmentSchedule("2099-10-12T08:59:00.000Z"),
          processName: "changeofname",
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.views.tenureInvestigation.documentsSigned, {
        exact: false,
      }),
    ).resolves.toBeDisabled();
    expect(container).toMatchSnapshot();
  });

  test("it renders NewTenancy view correctly for state=TenureAppointmentScheduled and closeProcessReason provided", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <NewTenancyView
        processConfig={processes.changeofname}
        process={{
          ...mockTenureAppointmentSchedule("2099-10-12T08:59:00.000Z"),
          processName: "changeofname",
        }}
        mutate={() => {}}
        optional={{
          submitted,
          setSubmitted,
          closeProcessReason: "Test",
        }}
      />,
      options,
    );
    expect(container).toMatchSnapshot();
  });

  test("it renders TenureInvestigation view correctly for state=TenureAppointmentScheduled, date has passed", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    render(
      <ChangeOfNameView
        process={{
          ...mockTenureAppointmentSchedule("2010-10-12T08:59:00.000Z"),
          processName: "changeofname",
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted }}
      />,
      options,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    const documentsSigned = screen.getByText(
      locale.views.tenureInvestigation.documentsSigned,
    );
    expect(documentsSigned).toBeEnabled();
    await userEvent.click(documentsSigned);
    expect(setSubmitted.mock.calls[0][0]).toBe(true);
  });

  test("it renders TenureInvestigation view correctly for state=TenureAppointmentScheduled, date has passed, submit fails", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    server.use(patchProcessV1({}, 500));
    render(
      <ChangeOfNameView
        process={{
          ...mockTenureAppointmentSchedule("2010-10-12T08:59:00.000Z"),
          processName: "changeofname",
        }}
        mutate={() => {}}
        optional={{ submitted: true, setSubmitted }}
      />,
      options,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await userEvent.click(screen.getByText(locale.views.closeProcess.outcomeLetterSent));
    await userEvent.click(screen.getByText(locale.confirm));
    await expect(
      screen.findByText("There was a problem with completing the action", {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
  });

  test("it renders TenureInvestigation view correctly for state=TenureAppointmentRescheduled", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <NewTenancyView
        processConfig={processes.changeofname}
        process={{
          ...mockProcessV1,
          processName: "changeofname",
          currentState: {
            ...mockProcessV1.currentState,
            state: "TenureAppointmentRescheduled",
            processData: {
              formData: {
                appointmentDateTime: "2099-10-12T08:59:00.000Z",
              },
              documents: [],
            },
          },
          previousStates: [
            {
              ...mockProcessV1.currentState,
              state: "TenureAppointmentScheduled",
              processData: {
                formData: {
                  appointmentDateTime: "2010-10-12T08:59:00.000Z",
                },
                documents: [],
              },
            },
          ],
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.views.tenureInvestigation.documentsSigned),
    ).resolves.toBeDisabled();
    expect(container).toMatchSnapshot();
  });

  test("it renders TenureInvestigation view correctly for state=NameUpdated", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <NewTenancyView
        processConfig={processes.changeofname}
        process={{
          ...mockProcessV1,
          processName: "changeofname",
          currentState: {
            ...mockProcessV1.currentState,
            state: "NameUpdated",
          },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.views.closeProcess.thankYouForConfirmation),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it renders TenureInvestigation view correctly for state=ProcessClosed", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <ChangeOfNameView
        process={{
          ...mockProcessV1,
          processName: "changeofname",
          currentState: {
            ...mockProcessV1.currentState,
            state: "ProcessClosed",
          },
          previousStates: [
            {
              ...mockProcessV1.currentState,
              state: "TenureAppointmentScheduled",
              processData: {
                formData: {
                  appointmentDateTime: "2010-10-12T08:59:00.000Z",
                },
                documents: [],
              },
            },
          ],
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.views.closeProcess.thankYouForConfirmation),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
