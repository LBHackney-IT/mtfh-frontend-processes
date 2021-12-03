import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { SoleToJointView } from "./sole-to-joint-view";

test("it renders soletojoint view for a started process", () => {
  render(<SoleToJointView />, {
    url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
    path: "/processes/soletojoint/:processId",
  });
  expect(screen.queryByText("e63e68c7-84b0-3a48-b450-896e2c3d7735")).toBeInTheDocument();
});
