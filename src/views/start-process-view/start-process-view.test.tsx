import { render } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";

import { locale, processes } from "../../services";
import { StartProcessView } from "./start-process-view";

test("it renders sole-to-joint start process view", async () => {
  const { container } = render(<StartProcessView />, {
    url: "/processes/sole-to-joint/start/tenure/8f6ff46b-6a92-0311-1ef6-61508321e65f",
    path: "/processes/:processName/start/:entityType/:entityId",
  });

  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, { exact: false }),
  ).resolves.toBeInTheDocument();

  await waitFor(() => {
    expect(container).toMatchSnapshot();
  });
});

test("it renders an error if an invalid process name is passed", async () => {
  render(<StartProcessView />, {
    url: "/processes/invalid-process-name/start/tenure/8f6ff46b-6a92-0311-1ef6-61508321e65f",
    path: "/processes/:processName/start/:entityType/:entityId",
  });

  await expect(
    screen.findByText(locale.errors.unableToFindProcess),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFindProcessDescription),
  ).resolves.toBeInTheDocument();
});

test("it enables form once checkbox is selected", async () => {
  render(<StartProcessView />, {
    url: "/processes/sole-to-joint/start/tenure/8f6ff46b-6a92-0311-1ef6-61508321e65f",
    path: "/processes/:processName/start/:entityType/:entityId",
  });

  const checkbox = await screen.findByLabelText(
    processes.soleToJoint.startProcess.thirdPartyCondition,
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
