import React from "react";

import {
  getPersonV1,
  getProcessV1,
  mockPersonV1,
  mockProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale } from "../../../services";
import { ProcessLayout } from "../process-layout";
import { ChangeOfNameSideBar, ChangeOfNameView } from "./change-of-name-view";
import { cancelButtonStates, reviewDocumentsStates } from "./view-utils";

import { $configuration } from "@mtfh/common";

const options = {
  url: "/processes/changeofname/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/:processName/:processId",
};

const setCancel = jest.fn();
const setCloseProcessDialogOpen = jest.fn();

describe("changeofname/change-of-name-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders ChangeOfNameView correctly on state EnterNewName", async () => {
    server.use(getPersonV1(mockPersonV1));
    const { container } = render(
      <ChangeOfNameView
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "EnterNewName" },
        }}
        mutate={() => {}}
        optional={{
          closeProcessReason: "",
          submitted: false,
          setSubmitted: () => {},
        }}
      />,
      options,
    );
    await expect(
      screen.findByText(`${mockPersonV1.firstName} ${mockPersonV1.surname}`),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByTestId("changeofname-EnterNewName"),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it renders error correctly on state UnknownState", async () => {
    server.use(getPersonV1());
    render(
      <ChangeOfNameView
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "UnknownState" },
        }}
        mutate={() => {}}
        optional={{
          closeProcessReason: "",
          submitted: false,
          setSubmitted: () => {},
        }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.errors.unableToFindState),
    ).resolves.toBeInTheDocument();
  });

  test("it renders error if person cannot be fetched", async () => {
    server.use(getPersonV1({}, 500));
    render(
      <ChangeOfNameView
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "UnknownState" },
        }}
        mutate={() => {}}
        optional={{
          closeProcessReason: "",
          submitted: false,
          setSubmitted: () => {},
        }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.errors.unableToFetchRecord),
    ).resolves.toBeInTheDocument();
  });

  test("it renders close process view if close process reason provided", async () => {
    server.use(getPersonV1());
    render(
      <ChangeOfNameView
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "NameSubmitted" },
        }}
        mutate={() => {}}
        optional={{
          closeProcessReason: "Test",
          submitted: false,
          setSubmitted: () => {},
        }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.views.closeProcess.outcomeLetterSent),
    ).resolves.toBeInTheDocument();
  });

  ["ProcessClosed", "ProcessCancelled"].forEach((state) => {
    test(`it renders close process view if state=${state}`, async () => {
      server.use(getPersonV1());
      render(
        <ChangeOfNameView
          process={{
            ...mockProcessV1,
            currentState: { ...mockProcessV1.currentState, state },
            previousStates: [{ ...mockProcessV1.currentState, state: "NameSubmitted" }],
          }}
          mutate={() => {}}
          optional={{
            closeProcessReason: "Test",
            submitted: false,
            setSubmitted: () => {},
          }}
        />,
        options,
      );
      await expect(
        screen.findByText(locale.views.closeProcess.thankYouForConfirmation),
      ).resolves.toBeInTheDocument();
      await expect(
        screen.findByText(locale.views.closeProcess.confirmationText),
      ).resolves.toBeInTheDocument();
    });
  });

  test("it renders ChangeOfName correctly for DocumentsRequestedDes state", async () => {
    server.use(
      getProcessV1({
        ...mockProcessV1,
        currentState: { ...mockProcessV1.currentState, state: "DocumentsRequestedDes" },
      }),
    );
    render(<ProcessLayout />, options);

    const stepper = await screen.findByTestId("mtfh-stepper-change-of-name");
    const steps = within(stepper).getAllByRole("listitem");
    expect(steps[1].className).not.toContain("active");
    expect(steps[2].className).toContain("active");
    await expect(
      screen.findByTestId("changeofname-ReviewDocuments"),
    ).resolves.toBeInTheDocument();
  });

  reviewDocumentsStates.forEach((state) => {
    test("it checks close case button", async () => {
      const setCancel = jest.fn();
      const setCloseProcessDialogOpen = jest.fn();
      server.use(getPersonV1());
      render(
        <ChangeOfNameView
          process={{
            ...mockProcessV1,
            currentState: {
              ...mockProcessV1.currentState,
              state,
              processData: {
                formData: {
                  appointmentDateTime: "2099-10-12T08:59:00.000Z",
                },
                documents: [],
              },
            },
          }}
          mutate={() => {}}
          optional={{
            closeProcessReason: "",
            submitted: false,
            setSubmitted: () => {},
            setCancel,
            setCloseProcessDialogOpen,
          }}
        />,
        options,
      );
      await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
      await userEvent.click(screen.getByText(locale.closeCase));
      expect(setCloseProcessDialogOpen.mock.calls[0][0]).toBe(true);
    });
  });

  test("it renders ChangeOfName correctly for DocumentChecksPassed state", async () => {
    server.use(
      getProcessV1({
        ...mockProcessV1,
        currentState: { ...mockProcessV1.currentState, state: "DocumentChecksPassed" },
      }),
    );
    render(<ProcessLayout />, options);

    const stepper = await screen.findByTestId("mtfh-stepper-change-of-name");
    const steps = within(stepper).getAllByRole("listitem");
    expect(steps[2].className).not.toContain("active");
    expect(steps[3].className).toContain("active");
    await expect(
      screen.findByText(locale.views.submitCase.tenureInvestigation),
    ).resolves.toBeInTheDocument();
  });

  test("it renders ChangeOfName correctly for ApplicationSubmitted state", async () => {
    server.use(
      getProcessV1({
        ...mockProcessV1,
        currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
      }),
    );
    render(<ProcessLayout />, options);

    await expect(
      screen.findByTestId("changeofname-tenure-investigation"),
    ).resolves.toBeInTheDocument();
  });

  ["InterviewScheduled", "InterviewRescheduled"].forEach((state) => {
    test(`it renders ChangeOfName correctly for ${state} state`, async () => {
      server.use(
        getProcessV1({
          ...mockProcessV1,
          processName: "changeofname",
          currentState: {
            ...mockProcessV1.currentState,
            state,
            processData: {
              formData: {
                appointmentDateTime: "2099-10-12T08:59:00.000Z",
              },
              documents: [],
            },
          },
        }),
      );
      render(<ProcessLayout />, options);

      await expect(
        screen.findByText("Office appointment scheduled"),
      ).resolves.toBeInTheDocument();

      const stepper = await screen.findByTestId("mtfh-stepper-change-of-name");
      const steps = within(stepper).getAllByRole("listitem");
      expect(steps[1].className).not.toContain("active");
      expect(steps[0].className).toContain("active");
    });
  });

  [
    "HOApprovalPassed",
    "TenureAppointmentScheduled",
    "TenureAppointmentRescheduled",
  ].forEach((state) => {
    test(`it renders ChangeOfName correctly for ${state} state`, async () => {
      server.use(
        getProcessV1({
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state,
            processData: {
              formData: {
                appointmentDateTime: "2099-10-12T08:59:00.000Z",
              },
              documents: [],
            },
          },
        }),
      );
      render(<ProcessLayout />, options);
      await expect(
        screen.findByTestId("changeofname-new-tenancy-view"),
      ).resolves.toBeInTheDocument();

      const stepper = await screen.findByTestId("mtfh-stepper-change-of-name");
      const steps = within(stepper).getAllByRole("listitem");
      expect(steps[1].className).not.toContain("active");
      expect(steps[0].className).toContain("active");
    });
  });

  test("it renders ChangeOfName correctly for HOApprovalFailed state", async () => {
    server.use(
      getProcessV1({
        ...mockProcessV1,
        processName: "changeofname",
        currentState: {
          ...mockProcessV1.currentState,
          state: "HOApprovalFailed",
        },
      }),
    );
    render(<ProcessLayout />, options);

    await expect(
      screen.findByText(locale.views.closeProcess.outcomeLetterSent),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.hoReviewView.hoOutcome("Decline")),
    ).resolves.toBeInTheDocument();

    const stepper = await screen.findByTestId("mtfh-stepper-change-of-name");
    const steps = within(stepper).getAllByRole("listitem");
    expect(steps[0].className).not.toContain("active");
    expect(steps[1].className).toContain("active");
  });

  describe("ChangeOfNameSideBar", () => {
    test("it renders ChangeOfNameSideBar correctly", async () => {
      $configuration.next({
        MMH: {
          configuration: {},
          featureToggles: {
            ReassignCase: true,
          },
        },
      });
      const { container } = render(
        <ChangeOfNameSideBar
          process={{
            ...mockProcessV1,
            currentState: { ...mockProcessV1.currentState, state: "UnknownState" },
          }}
          submitted={false}
          closeProcessReason=""
          setCloseProcessDialogOpen={setCloseProcessDialogOpen}
          setCancel={setCancel}
        />,
        options,
      );
      expect(container).toMatchSnapshot();
    });

    test("it renders ChangeOfNameSideBar correctly for NameSubmitted state", async () => {
      render(
        <ChangeOfNameSideBar
          process={{
            ...mockProcessV1,
            currentState: { ...mockProcessV1.currentState, state: "NameSubmitted" },
          }}
          submitted={false}
          closeProcessReason=""
          setCloseProcessDialogOpen={setCloseProcessDialogOpen}
          setCancel={setCancel}
        />,
        options,
      );

      const stepper = await screen.findByTestId("mtfh-stepper-change-of-name");
      const steps = within(stepper).getAllByRole("listitem");
      expect(steps[0].className).not.toContain("active");
      expect(steps[1].className).toContain("active");
    });

    test("it renders ChangeOfName sidebar correctly for ApplicationSubmitted state, submitted=true", async () => {
      render(
        <ChangeOfNameSideBar
          process={{
            ...mockProcessV1,
            currentState: {
              ...mockProcessV1.currentState,
              state: "ApplicationSubmitted",
            },
          }}
          submitted
          closeProcessReason=""
          setCloseProcessDialogOpen={setCloseProcessDialogOpen}
          setCancel={setCancel}
        />,
        options,
      );

      const stepper = await screen.findByTestId("mtfh-stepper-change-of-name");
      const steps = within(stepper).getAllByRole("listitem");
      expect(steps[3].className).not.toContain("active");
      expect(steps[4].className).toContain("active");
    });

    test("it renders ChangeOfName sidebar correctly for ApplicationSubmitted state, submitted false", async () => {
      render(
        <ChangeOfNameSideBar
          process={{
            ...mockProcessV1,
            currentState: {
              ...mockProcessV1.currentState,
              state: "ApplicationSubmitted",
            },
          }}
          submitted={false}
          closeProcessReason=""
          setCloseProcessDialogOpen={setCloseProcessDialogOpen}
          setCancel={setCancel}
        />,
        options,
      );

      const stepper = await screen.findByTestId("mtfh-stepper-change-of-name");
      const steps = within(stepper).getAllByRole("listitem");
      expect(steps[1].className).not.toContain("active");
      expect(steps[0].className).toContain("active");
    });

    cancelButtonStates.forEach((state) => {
      test(`it shows Cancel button in ChangeOfNameSideBar for ${state} state`, async () => {
        render(
          <ChangeOfNameSideBar
            process={{
              ...mockProcessV1,
              currentState: { ...mockProcessV1.currentState, state },
            }}
            submitted={false}
            closeProcessReason=""
            setCloseProcessDialogOpen={setCloseProcessDialogOpen}
            setCancel={setCancel}
          />,
          options,
        );
        await userEvent.click(
          screen.getByText(locale.views.changeofname.actions.cancelProcess),
        );
        expect(setCancel.mock.calls[0][0]).toBe(true);
      });
    });
  });
});
