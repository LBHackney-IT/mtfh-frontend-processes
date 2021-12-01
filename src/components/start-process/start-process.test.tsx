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
