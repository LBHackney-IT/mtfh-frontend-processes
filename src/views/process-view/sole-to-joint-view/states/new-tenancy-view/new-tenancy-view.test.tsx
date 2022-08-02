import {
  getContactDetailsV2,
  getReferenceDataV1,
  mockContactDetailsV2,
  mockProcessV1,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../../services";
import { ReviewApplicationView } from "../review-application-view/review-application-view";

let submitted = false;
const setSubmitted = () => {};

const options = {
  url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
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

  test("it renders NewTenancy view correctly for TenureAppointmentScheduled state", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockTenureAppointmentSchedule("2099-10-12T08:59:00.000Z"),
          processName: "soletojoint",
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted }}
      />,
      options,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await expect(
      screen.findByText(locale.views.tenureInvestigation.documentsSigned, {
        exact: false,
      }),
    ).resolves.toBeDisabled();
    expect(container).toMatchSnapshot();
  });

  test("it renders TenureInvestigation view correctly for TenureAppointmentScheduled state, date has passed, submit fails", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    server.use(patchProcessV1({}, 500));
    render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={mockTenureAppointmentSchedule("2010-10-12T08:59:00.000Z")}
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
    await userEvent.click(screen.getByText(locale.views.closeProcess.outcomeLetterSent));
    await userEvent.click(screen.getByText(locale.confirm));
    await expect(
      screen.findByText("There was a problem with completing the action", {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
  });

  test("it renders TenureInvestigation view correctly for TenureAppointmentRescheduled state", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          processName: "soletojoint",
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
            {
              ...mockProcessV1.currentState,
              state: "HOApprovalPassed",
              processData: {
                formData: {
                  reason: "Test",
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
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await expect(
      screen.findByText(locale.views.tenureInvestigation.documentsSigned, {
        exact: false,
      }),
    ).resolves.toBeDisabled();
    expect(container).toMatchSnapshot();
  });
});
