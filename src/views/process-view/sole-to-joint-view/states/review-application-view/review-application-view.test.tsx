import {
  getContactDetailsV2,
  getReferenceDataV1,
  getTenureV1,
  mockContactDetailsV2,
  mockProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";

import { locale, processes } from "../../../../../services";
import { SoleToJointView } from "../../sole-to-joint-view";
import { ReviewApplicationView } from "./review-application-view";

let submitted = false;
let closeCase = false;
const setSubmitted = () => {};
const setCloseCase = () => {};

const options = {
  url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/:processName/:processId",
};

describe("tenure-investigation-view", () => {
  beforeEach(() => {
    jest.resetModules();
    submitted = false;
    closeCase = false;
  });

  test("it renders ReviewApplication view correctly for ApplicationSubmitted state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      options,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await expect(
      screen.findByText(locale.views.tenureInvestigation.tenureInvestigationCompleted, {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it renders no tenant found if no tenant", async () => {
    server.use(getTenureV1({ householdMembers: [] }));
    render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      options,
    );
    await expect(
      screen.findByText("Tenant not found.", {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
  });

  test("it renders error if tenure cannot be fetched", async () => {
    server.use(getTenureV1(null, 500));
    render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.errors.unableToFetchRecordDescription, {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
  });

  test("it renders ReviewApplication view correctly for close case", async () => {
    closeCase = true;
    server.use(getContactDetailsV2(mockContactDetailsV2));
    render(
      <SoleToJointView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: "TenureAppointmentRescheduled",
            processData: {
              formData: {
                appointmentDateTime: "2010-10-17T08:59:00.000Z",
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
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.views.reviewDocuments.soleToJointWillBeClosed),
    ).resolves.toBeInTheDocument();
  });

  test("it renders ReviewApplication view correctly for TenureUpdated state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    server.use(getReferenceDataV1());
    const { container } = render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          processName: "soletojoint",
          currentState: {
            ...mockProcessV1.currentState,
            state: "TenureUpdated",
          },
          relatedEntities: [
            {
              id: "f8daaf21-edfc-4abc-9c39-403b84a142cb",
              targetType: "tenure",
              subType: "newTenure",
              description: "New Tenure created for this process.",
            },
          ],
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.views.tenureInvestigation.tenancySigned),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.tenureInvestigation.viewNewTenure),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.closeProcess.thankYouForConfirmation),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
