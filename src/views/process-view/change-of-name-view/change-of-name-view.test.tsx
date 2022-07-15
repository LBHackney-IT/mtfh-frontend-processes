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
          closeProcessReasonFinal: "",
          submitted: false,
          setSubmitted: () => {},
          closeCase: false,
          setCloseCase: () => {},
        }}
      />,
      options,
    );
    await expect(
      screen.findByText(`${mockPersonV1.firstName} ${mockPersonV1.surname}`),
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
          closeProcessReasonFinal: "",
          submitted: false,
          setSubmitted: () => {},
          closeCase: false,
          setCloseCase: () => {},
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
          closeProcessReasonFinal: "",
          submitted: false,
          setSubmitted: () => {},
          closeCase: false,
          setCloseCase: () => {},
        }}
      />,
      options,
    );
    await expect(
      screen.findByText(locale.errors.unableToFetchRecord),
    ).resolves.toBeInTheDocument();
  });

  test("it renders ChangeOfNameSideBar correctly", async () => {
    const { container } = render(
      <ChangeOfNameSideBar
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "UnknownState" },
        }}
        submitted={false}
        closeCase={false}
        setCloseProcessDialogOpen={setCloseProcessDialogOpen}
        setCancel={setCancel}
      />,
      options,
    );
    await userEvent.click(
      screen.getByText(locale.views.changeofname.actions.cancelProcess),
    );
    expect(setCancel.mock.calls[0][0]).toBe(true);
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
        closeCase={false}
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

  test("it checks close case button", async () => {
    const setCancel = jest.fn();
    const setCloseProcessDialogOpen = jest.fn();
    server.use(getPersonV1());
    render(
      <ChangeOfNameView
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "DocumentsRequestedDes" },
        }}
        mutate={() => {}}
        optional={{
          closeProcessReasonFinal: "",
          submitted: false,
          setSubmitted: () => {},
          closeCase: false,
          setCloseCase: () => {},
          setCancel,
          setCloseProcessDialogOpen,
        }}
      />,
      options,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await userEvent.click(screen.getByText(locale.closeCase));
    expect(setCancel.mock.calls[0][0]).toBe(false);
    expect(setCloseProcessDialogOpen.mock.calls[0][0]).toBe(true);
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

  test("it renders ChangeOfName sidebar correctly for ApplicationSubmitted state, submitted=true", async () => {
    render(
      <ChangeOfNameSideBar
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        submitted
        closeCase={false}
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
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        submitted={false}
        closeCase={false}
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
});
