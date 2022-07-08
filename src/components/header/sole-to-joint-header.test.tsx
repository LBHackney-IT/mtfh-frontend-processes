import React from "react";

import { mockActiveTenureV1, mockProcessV1, render } from "@hackney/mtfh-test-utils";

import { processes } from "../../services";
import { SoleToJointHeader } from "./sole-to-joint-header";

import * as tenureService from "@mtfh/common/lib/api/tenure/v1/service";
import { Tenure } from "@mtfh/common/lib/api/tenure/v1/types";
import { AxiosSWRResponse } from "@mtfh/common/lib/http";

describe("Sole to joint header", () => {
  test("it renders sole to joint header correctly", async () => {
    jest
      .spyOn(tenureService, "useTenure")
      .mockReturnValue({ data: mockActiveTenureV1 } as AxiosSWRResponse<Tenure>);
    const { container } = render(
      <SoleToJointHeader processConfig={processes.soletojoint} process={mockProcessV1} />,
    );
    expect(container).toMatchSnapshot();
  });
});
