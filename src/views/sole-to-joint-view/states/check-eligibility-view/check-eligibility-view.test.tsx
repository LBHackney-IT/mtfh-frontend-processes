import { mockProcessV1, render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { processes } from "../../../../services";
import { CheckEligibilityView } from "./check-eliigibility-view";

test("it renders CheckEligibilityView correctly", async () => {
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessV1}
    />,
    {
      url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
      path: "/processes/soletojoint/:processId",
    },
  );

  await expect(
    screen.findByText(mockProcessV1.currentState.stateName),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(processes.soletojoint.processName),
  ).resolves.toBeInTheDocument();
});
