import { render } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";

import { locale, processes } from "../../services";
import { generateMockProcessV1 } from "../../test-utils";
import { StartProcess } from "./start-process";

const mockedProcess = generateMockProcessV1();

const targetId = "fee0914a-3e45-4a4f-95c7-a0adfd2026c9";

test("it enables form once checkbox is selected", async () => {
  render(
    <StartProcess
      targetId={targetId}
      process={processes.soletojoint.startProcess}
      backLink="back-link"
      processName={processes.soletojoint.processName}
    />,
  );

  const checkbox = await screen.findByLabelText(
    `${processes.soletojoint.startProcess.thirdPartyCondition}`,
  );

  const startProcessButton = await screen.findByText(
    locale.components.startProcess.buttonLabel,
  );

  expect(startProcessButton).toBeDisabled();

  checkbox.click();

  await waitFor(() => {
    expect(startProcessButton).not.toBeDisabled();
    startProcessButton.click();
  });

  await waitFor(() => {
    expect(window.location.pathname).toContain(
      "/processes/soletojoint/6fbe024f-2316-4265-a6e8-d65a837e308a",
    );
  });
});

test("Renders without third party content", async () => {
  const { thirdPartyComponent, thirdPartyCondition, ...rest } =
    processes.soletojoint.startProcess;

  const { container } = render(
    <StartProcess
      targetId={targetId}
      process={rest}
      backLink="back-link"
      processName={processes.soletojoint.processName}
    />,
  );

  await waitFor(() =>
    expect(
      screen.queryByText(locale.components.startProcess.thirdPartyHeading),
    ).not.toBeInTheDocument(),
  );

  expect(container).toMatchSnapshot();
});

test("Renders without risk content", async () => {
  const { riskComponent, riskHeading, ...rest } = processes.soletojoint.startProcess;

  const { container } = render(
    <StartProcess
      targetId={targetId}
      process={rest}
      backLink="back-link"
      processName={processes.soletojoint.processName}
    />,
  );
  await waitFor(() => expect(container).toMatchSnapshot());
});
