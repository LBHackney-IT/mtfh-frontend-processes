import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";

import { ContactDetailsUpdateDialog } from "./contact-details-update-dialog";

import * as errorMessages from "@mtfh/common/lib/hooks/use-error-codes";

const setDialogOpen = jest.fn();

beforeEach(() => {
  jest.resetModules();
  jest.spyOn(errorMessages, "useErrorCodes").mockReturnValue({});
});

test("it ContactDetailsUpdateDialog as expected when it is open", async () => {
  const { baseElement } = render(
    <ContactDetailsUpdateDialog
      isDialogOpen
      setDialogOpen={setDialogOpen}
      personId="85e030a6-3ecf-424e-b965-0c9b5c19f21e"
    />,
  );
  await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
  await expect(screen.findByText("Return to application")).resolves.toBeInTheDocument();
  expect(screen.queryByText("Next")).not.toBeInTheDocument();
  expect(screen.queryByText("Add a correspondence address")).not.toBeInTheDocument();
  await screen.findByText("Email addresses");
  expect(baseElement).toMatchSnapshot();
});
