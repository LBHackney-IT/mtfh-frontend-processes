import { render } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";

import { locale } from "../../services";
import { StartProcessView } from "./start-process-view";

test("it renders soletojoint start process view", async () => {
  const { container } = render(<StartProcessView />, {
    url: "/processes/soletojoint/start/tenure/8f6ff46b-6a92-0311-1ef6-61508321e65f",
    path: "/processes/:processName/start/:targetType/:targetId",
  });

  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, { exact: false }),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.components.startProcess.buttonLabel),
  ).resolves.toBeInTheDocument();
  await waitFor(() => {
    expect(container).toMatchSnapshot();
  });
});

test("it renders an error if an invalid process name is passed", async () => {
  render(<StartProcessView />, {
    url: "/processes/invalid-process-name/start/tenure/8f6ff46b-6a92-0311-1ef6-61508321e65f",
    path: "/processes/:processName/start/:targetType/:targetId",
  });

  await expect(
    screen.findByText(locale.errors.unableToFindProcess),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFindProcessDescription),
  ).resolves.toBeInTheDocument();
});
