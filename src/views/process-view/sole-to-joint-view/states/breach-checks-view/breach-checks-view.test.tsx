import React from "react";

import {
  getProcessV1,
  mockProcessV1,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../../services";
import {
  mockBreachChecksFailedState,
  mockManualChecksPassedState,
} from "../../../../../test-utils";
import { SoleToJointView } from "../../sole-to-joint-view";
import { BreachCheckForm, BreachChecksView } from "./breach-checks-view";

import * as processV1 from "@mtfh/common/lib/api/process/v1/service";
import commonLocale from "@mtfh/common/lib/locale";

const url = "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735";
const path = "/processes/soletojoint/:processId";
const options = {
  url,
  path,
};
let submitted = false;
const setSubmitted = jest.fn();

beforeEach(() => {
  submitted = false;
});

test("it should show sub options for Cautionary contact only if Yes selected", async () => {
  render(
    <BreachCheckForm
      processConfig={processes.soletojoint}
      process={mockManualChecksPassedState}
      mutate={() => {}}
      setGlobalError={() => {}}
    />,
    options,
  );

  await expect(
    screen.queryByText("Allow application to proceed", { exact: true }),
  ).toBeNull();

  await userEvent.click(await screen.findByTestId("breach-form-type-cautionary-yes"));
  let allowApplicationRadio = screen.getByTestId(
    "breach-form-type-cautionary-yes-allow-application",
  );
  await userEvent.click(allowApplicationRadio);

  expect(allowApplicationRadio).toBeChecked();

  await expect(
    screen.queryByText("Allow application to proceed", { exact: true }),
  ).toBeInTheDocument();

  await userEvent.click(screen.getByTestId("breach-form-type-cautionary-no"));

  await expect(
    screen.queryByText("Allow application to proceed", { exact: true }),
  ).toBeNull();

  await userEvent.click(screen.getByTestId("breach-form-type-cautionary-yes"));

  allowApplicationRadio = screen.getByTestId(
    "breach-form-type-cautionary-yes-allow-application",
  );

  await expect(allowApplicationRadio).toBeInTheDocument();
  expect(allowApplicationRadio).not.toBeChecked();
});

test("it submits form correctly", async () => {
  const editProcessSpy = jest.spyOn(processV1, "editProcess");
  server.use(patchProcessV1("error", 500));
  render(
    <BreachChecksView
      processConfig={processes.soletojoint}
      process={mockManualChecksPassedState}
      mutate={() => {}}
      optional={{ submitted, setSubmitted }}
    />,
    options,
  );
  const radios = await screen.findAllByRole("radio");
  await userEvent.click(radios[1]);
  await userEvent.click(radios[3]);
  await userEvent.click(radios[5]);
  await expect(screen.getByText("Next")).toBeEnabled();
  await userEvent.click(screen.getByText("Next"));

  expect(editProcessSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      processTrigger: "CheckTenancyBreach",
    }),
  );
  await expect(
    screen.findByText(commonLocale.components.statusErrorSummary.statusTitle(500)),
  ).resolves.toBeInTheDocument();
});

test("it renders CheckEligibility for state=ManualChecksPassed, submitted=false", async () => {
  render(
    <BreachChecksView
      processConfig={processes.soletojoint}
      process={mockManualChecksPassedState}
      mutate={() => {}}
      optional={{ submitted, setSubmitted }}
    />,
    options,
  );
  await expect(screen.findByText("Breach of tenure")).resolves.toBeInTheDocument();
});

test("it renders CheckEligibility for state=ManualChecksPassed, submitted=true", async () => {
  submitted = true;
  render(
    <BreachChecksView
      processConfig={processes.soletojoint}
      process={mockManualChecksPassedState}
      mutate={() => {}}
      optional={{ submitted, setSubmitted }}
    />,
    options,
  );
  await expect(screen.findByText("Next Steps:")).resolves.toBeInTheDocument();
  await userEvent.click(screen.getByText("Continue"));
  expect(setSubmitted.mock.calls[0][0]).toBe(false);
});

test("it renders BreachChecksFailedView for state=BreachChecksFailed", async () => {
  server.use(getProcessV1(mockBreachChecksFailedState));
  render(
    <SoleToJointView
      process={mockBreachChecksFailedState}
      mutate={() => {}}
      optional={{}}
    />,
    options,
  );

  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, {
      exact: false,
    }),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.autoCheckIntro),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText("Failed breach of tenure check:"),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.closeProcess.outcomeLetterSent),
  ).resolves.toBeInTheDocument();
});

test("it renders BreachChecksFailedView for state=ProcessClosed, previousState=BreachChecksFailed", async () => {
  server.use(getProcessV1());
  render(
    <SoleToJointView
      process={{
        ...mockProcessV1,
        currentState: {
          ...mockProcessV1.currentState,
          state: "ProcessClosed",
        },
        previousStates: [
          {
            ...mockProcessV1.currentState,
            state: "BreachChecksFailed",
          },
        ],
      }}
      mutate={() => {}}
      optional={{}}
    />,
    options,
  );

  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, {
      exact: false,
    }),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.autoCheckIntro),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.failedChecks),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.closeProcess.thankYouForConfirmation),
  ).resolves.toBeInTheDocument();
});
