import React from "react";

import { render } from "@hackney/mtfh-test-utils";

import { mockManualChecksFailedState } from "../../../../../test-utils";
import { ManualChecksFailedView } from "./manual-checks-view";

describe("manual-checks-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders ManualChecksView correctly", async () => {
    const { container } = render(
      <ManualChecksFailedView process={mockManualChecksFailedState} />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    expect(container).toMatchSnapshot();
  });
});
