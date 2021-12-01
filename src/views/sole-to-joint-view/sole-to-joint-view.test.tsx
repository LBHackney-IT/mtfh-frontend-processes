import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { SoleToJointView } from "./sole-to-joint-view";

test("it renders sole-to-joint view for a started process", () => {
  render(<SoleToJointView />, {
    url: "/processes/sole-to-joint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
    path: "/processes/sole-to-joint/:processId",
  });
  expect(screen.queryByText("e63e68c7-84b0-3a48-b450-896e2c3d7735")).toBeInTheDocument();
});
