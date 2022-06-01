import React from "react";

import { render } from "@hackney/mtfh-test-utils";

import { processes } from "../../../services";
import { mockBreachChecksFailedState, mockProcessClosedState } from "../../../test-utils";
import { CloseProcessView } from "./close-process-view";

describe("close-process-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders CloseProcessView correctly for state=ProcessClosed", async () => {
    const { container } = render(
      <CloseProcessView
        processConfig={processes.soletojoint}
        process={mockProcessClosedState}
        mutate={() => {}}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    expect(container).toMatchSnapshot();
  });

  test("it renders CloseProcessView correctly for state!=ProcessClosed", async () => {
    const { container } = render(
      <CloseProcessView
        processConfig={processes.soletojoint}
        process={mockBreachChecksFailedState}
        mutate={() => {}}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    expect(container).toMatchSnapshot();
  });
});
