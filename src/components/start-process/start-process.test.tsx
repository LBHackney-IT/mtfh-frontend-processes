import { render } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";

import { locale, processes } from "../../services";
import { StartProcess } from "./start-process";

test("it enables form once checkbox is selected", async () => {
  render(
    <StartProcess
      process={processes.soleToJoint.startProcess}
      backLink="back-link"
      processName={processes.soleToJoint.urlPath}
    />,
  );

  const checkbox = await screen.findByLabelText(
    `${processes.soleToJoint.startProcess.thirdPartyCondition}`,
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

  expect(window.location.pathname).toContain("/processes/sole-to-joint/generated-id");
});

test("Renders without third party content", async () => {
  const { thirdPartyComponent, thirdPartyCondition, ...rest } =
    processes.soleToJoint.startProcess;

  const { container } = render(
    <StartProcess
      process={rest}
      backLink="back-link"
      processName={processes.soleToJoint.urlPath}
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
  const { riskComponent, riskHeading, ...rest } = processes.soleToJoint.startProcess;

  const { container } = render(
    <StartProcess
      process={rest}
      backLink="back-link"
      processName={processes.soleToJoint.urlPath}
    />,
  );
  await waitFor(() => expect(container).toMatchSnapshot());
});
