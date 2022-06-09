import {
  getContactDetailsV2,
  getTenureV1,
  mockContactDetailsV2,
  mockProcessV1,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../services";
import { SubmitCaseView } from "../submit-case-view";
import { TenureInvestigationView } from "./tenure-investigation-view";

let submitted = false;
let closeCase = false;
const setSubmitted = () => {};
const setCloseCase = () => {};

describe("tenure-investigation-view", () => {
  beforeEach(() => {
    jest.resetModules();
    submitted = false;
    closeCase = false;
  });

  test("it renders TenureInvestigation view correctly for ApplicationSubmitted state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <SubmitCaseView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
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
      <SubmitCaseView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
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
      <SubmitCaseView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText(locale.errors.unableToFetchRecordDescription, {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
  });

  test("it enables buttons when checkbox is checked", async () => {
    render(
      <SubmitCaseView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );

    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));

    const approve = screen.getByText(locale.views.tenureInvestigation.approve);
    const appointment = screen.getByText(locale.views.tenureInvestigation.appointment);
    const decline = screen.getByText(locale.views.tenureInvestigation.decline);
    await userEvent.click(
      screen.getByLabelText(
        locale.views.tenureInvestigation.tenureInvestigationCompleted,
      ),
    );
    expect(approve).toBeEnabled();
    expect(appointment).toBeEnabled();
    expect(decline).toBeEnabled();
    await userEvent.click(approve);
    await userEvent.click(appointment);
    await userEvent.click(decline);
  });

  test("it renders error if submit fails", async () => {
    server.use(patchProcessV1(null, 500));
    render(
      <SubmitCaseView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await userEvent.click(
      screen.getByLabelText(
        locale.views.tenureInvestigation.tenureInvestigationCompleted,
      ),
    );
    await userEvent.click(screen.getByText(locale.views.tenureInvestigation.approve));
    await expect(
      screen.findByText("There was a problem with completing the action", {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
  });

  test("it renders TenureInvestigation view correctly for HOApprovalPassed state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <TenureInvestigationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "HOApprovalPassed" },
        }}
        mutate={() => {}}
        optional={{ closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await expect(
      screen.findByText(locale.views.tenureInvestigation.mustMakeAppointment, {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it renders TenureInvestigation view correctly for TenureAppointmentScheduled state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <TenureInvestigationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            processData: {
              formData: {
                appointmentDateTime: "2099-10-12T08:59:00.000Z",
              },
              documents: [],
            },
            state: "TenureAppointmentScheduled",
          },
        }}
        mutate={() => {}}
        optional={{ closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText(locale.views.tenureInvestigation.documentsSigned, {
        exact: false,
      }),
    ).resolves.toBeDisabled();
    expect(container).toMatchSnapshot();
  });

  test("it renders TenureInvestigation view correctly for TenureAppointmentScheduled state, date has passed", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    server.use(patchProcessV1(null, 500));
    render(
      <TenureInvestigationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            processData: {
              formData: {
                appointmentDateTime: "2010-10-12T08:59:00.000Z",
              },
              documents: [],
            },
            state: "TenureAppointmentScheduled",
          },
        }}
        mutate={() => {}}
        optional={{ closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    const documentsSigned = screen.getByText(
      locale.views.tenureInvestigation.documentsSigned,
    );
    expect(documentsSigned).toBeEnabled();
    await userEvent.click(documentsSigned);
    await expect(
      screen.findByText("There was a problem with completing the action", {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
  });

  test("it renders TenureInvestigation view correctly for TenureAppointmentRescheduled state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <TenureInvestigationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            processData: {
              formData: {
                appointmentDateTime: "2099-10-12T08:59:00.000Z",
              },
              documents: [],
            },
            state: "TenureAppointmentRescheduled",
          },
          previousStates: [
            {
              state: "TenureAppointmentScheduled",
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
              state: "HOApprovalPassed",
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
        mutate={() => {}}
        optional={{ closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await expect(
      screen.findByText(locale.views.tenureInvestigation.documentsSigned, {
        exact: false,
      }),
    ).resolves.toBeDisabled();
    expect(container).toMatchSnapshot();
  });

  test("it renders TenureInvestigation view correctly for close case", async () => {
    closeCase = true;
    server.use(getContactDetailsV2(mockContactDetailsV2));
    render(
      <TenureInvestigationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            processData: {
              formData: {
                appointmentDateTime: "2010-10-17T08:59:00.000Z",
              },
              documents: [],
            },
            state: "TenureAppointmentRescheduled",
          },
          previousStates: [
            {
              state: "TenureAppointmentScheduled",
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
          ],
        }}
        mutate={() => {}}
        optional={{ closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText(locale.views.closeCase.soleToJointClosed),
    ).resolves.toBeInTheDocument();
  });

  test("it renders TenureInvestigation view correctly for TenureUpdated state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    render(
      <TenureInvestigationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "TenureUpdated" },
        }}
        mutate={() => {}}
        optional={{ closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText(locale.views.tenureInvestigation.tenancySigned),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.tenureInvestigation.viewNewTenure),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.closeCase.outcomeLetterSent),
    ).resolves.toBeInTheDocument();
  });
});
