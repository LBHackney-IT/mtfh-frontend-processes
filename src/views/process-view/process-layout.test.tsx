import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { ProcessLayout } from "./process-layout";

const processId = "e63e68c7-84b0-3a48-b450-896e2c3d7735";

describe("process-layout", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("it renders correct views when processName is soletojoint", async () => {
    const processName = "soletojoint";
    const options = {
      path: "/processes/:processName/:processId",
      url: `/processes/${processName}/${processId}`,
    };

    render(<ProcessLayout />, options);

    await expect(
      screen.findByText("Sole tenant requests a joint tenure"),
    ).resolves.toBeInTheDocument();
    await expect(screen.getByTestId("mtfh-stepper-sole-to-joint")).toBeInTheDocument();
    await expect(screen.getByTestId("error-sole-to-joint-view")).toBeInTheDocument();
  });

  test("it renders correct views when processName is changeofname", async () => {
    const processName = "changeofname";
    const options = {
      path: "/processes/:processName/:processId",
      url: `/processes/${processName}/${processId}`,
    };

    render(<ProcessLayout />, options);

    await expect(screen.findByText("Change of Name")).resolves.toBeInTheDocument();
    await expect(screen.getByTestId("mtfh-stepper-change-of-name")).toBeInTheDocument();
    await expect(screen.getByTestId("error-change-of-name-view")).toBeInTheDocument();
  });
});
