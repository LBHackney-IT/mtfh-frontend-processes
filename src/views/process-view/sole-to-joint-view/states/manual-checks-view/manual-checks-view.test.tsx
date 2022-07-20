import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale, processes } from "../../../../../services";
import { mockManualChecksFailedState } from "../../../../../test-utils";
import { SoleToJointView } from "../../sole-to-joint-view";

describe("manual-checks-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders ManualChecksFailedView correctly, state=ManualChecksFailed", async () => {
    const { container } = render(
      <SoleToJointView
        processConfig={processes.soletojoint}
        process={mockManualChecksFailedState}
        mutate={() => {}}
        optional={{}}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText(locale.views.checkEligibility.autoCheckIntro),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.checkEligibility.failedChecks),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(locale.views.closeProcess.outcomeLetterSent),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
