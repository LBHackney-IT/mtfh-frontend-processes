import React from "react";

import { mockProcessV1, render } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";

import { processes } from "../../../services";
import { SoleToJointHeader } from "./sole-to-joint-header";

describe("Sole to joint header", () => {
  test("it renders sole to joint header correctly", async () => {
    render(
      <SoleToJointHeader processConfig={processes.soletojoint} process={mockProcessV1} />,
    );
    await waitFor(() =>
      expect(screen.getAllByRole("heading")[0]).toHaveTextContent(
        processes.soletojoint.title,
      ),
    );
  });
});
