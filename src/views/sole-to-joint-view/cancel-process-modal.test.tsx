import React from "react";

import { getProcessV1, render, server } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale } from "../../services";
import { mockDocumentsRequestedDes } from "../../test-utils";
import { ProcessLayout } from "../process-layout/process-layout";

const options = {
  url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/:processName/:processId",
};

test("it displays close case dialog on close case button click and closes on cancel", async () => {
  server.use(getProcessV1(mockDocumentsRequestedDes));
  render(<ProcessLayout />, options);
  await expect(screen.findByText(locale.closeCase)).resolves.toBeInTheDocument();

  await userEvent.click(screen.getByText(locale.closeCase));
  await expect(
    screen.findByText(locale.views.closeProcess.reasonForCloseCase, { exact: false }),
  ).resolves.toBeInTheDocument();
  await userEvent.click(await screen.findByTestId("close-process-modal-submit"));
  expect(
    screen.queryByText(locale.views.closeProcess.reasonForCloseCase, { exact: false }),
  ).not.toBeInTheDocument();
});
