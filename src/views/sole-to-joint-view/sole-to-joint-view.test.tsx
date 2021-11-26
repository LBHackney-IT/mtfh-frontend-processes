import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { SoleToJointView } from "./sole-to-joint-view";

test("it renders sole-to-joint initiate view", () => {
  render(<SoleToJointView />, {
    url: "/processes/:entityType/:id/sole-to-joint",
    path: "/processes/:entityType/:id/sole-to-joint",
  });
  expect(screen.getByText(locale.processes.soleToJoint.title)).toBeInTheDocument();
});

test("it renders sole-to-joint view for a started process", () => {
  render(<SoleToJointView />, {
    url: "/processes/:entityType/:id/sole-to-joint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
    path: "/processes/:entityType/:id/sole-to-joint/:processId",
  });
  expect(screen.queryByText(locale.processes.soleToJoint.title)).not.toBeInTheDocument();
});
