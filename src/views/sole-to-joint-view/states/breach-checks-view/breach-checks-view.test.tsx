import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { processes } from "../../../../services";
import { mockManualChecksPassedState } from "../../../../test-utils";
import { BreachCheckForm } from "./breach-checks-view";

const url = "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735";
const path = "/processes/soletojoint/:processId";
const options = {
  url,
  path,
};

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

  await userEvent.click(screen.getByTestId("breach-form-type-cautionary-yes"));
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
