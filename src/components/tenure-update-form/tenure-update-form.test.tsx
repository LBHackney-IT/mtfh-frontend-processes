import React from "react";

import { getReferenceDataV1, render, server } from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { mockDocumentsRequestedDes } from "../../test-utils";
import { TenureUpdateForm } from "./tenure-update-form";

describe("tenure-update-form-component", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders tenure update form correctly", async () => {
    server.use(getReferenceDataV1({}, 200));
    const { container } = render(
      <TenureUpdateForm
        process={mockDocumentsRequestedDes}
        mutate={() => {}}
        setGlobalError={() => {}}
      />,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    expect(container).toMatchSnapshot();
    expect(screen.getByText("Confirm")).toBeDisabled();
    await userEvent.click(screen.getByText("I confirm I have completed the tasks above"));
    expect(screen.getByText("Confirm")).toBeEnabled();
  });
});
