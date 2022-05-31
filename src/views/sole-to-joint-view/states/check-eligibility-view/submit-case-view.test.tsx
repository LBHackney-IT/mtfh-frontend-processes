import { mockProcessV1, patchProcessV1, render, server } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../services";
import { SubmitCaseView } from "./submit-case-view";

const mockDocumentChecksPassedProcess = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, state: "DocumentChecksPassed" },
};

describe("submit-case-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders SubmitCaseView correctly", async () => {
    render(
      <SubmitCaseView
        processConfig={processes.soletojoint}
        process={mockDocumentChecksPassedProcess}
        mutate={() => {}}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText(locale.views.reviewDocuments.documentsRequested),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.reviewDocuments.passedChecks),
    ).resolves.toBeInTheDocument();
    await expect(screen.findByText(locale.submitCase)).resolves.toBeInTheDocument();
  });

  test("it renders SubmitCaseView error when submit not successful", async () => {
    server.use(patchProcessV1("error", 500));
    render(
      <SubmitCaseView
        processConfig={processes.soletojoint}
        process={mockDocumentChecksPassedProcess}
        mutate={() => {}}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await userEvent.click(screen.getByText(locale.submitCase));
    await expect(
      screen.findByText("There was a problem with completing the action"),
    ).resolves.toBeInTheDocument();
  });
});
