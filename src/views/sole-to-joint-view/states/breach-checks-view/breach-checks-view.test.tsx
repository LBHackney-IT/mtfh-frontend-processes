import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../services";
import { mockManualChecksPassedState } from "../../../../test-utils";
import { BreachCheckForm, BreachChecksView } from "./breach-checks-view";

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
  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, {
      exact: false,
    }),
  ).resolves.toBeInTheDocument();
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
  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, {
      exact: false,
    }),
  ).resolves.toBeInTheDocument();
  await expect(screen.findByText("Next Steps:")).resolves.toBeInTheDocument();
  await userEvent.click(screen.getByText("Continue"));
  expect(setSubmitted.mock.calls[0][0]).toBe(false);
});
