import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { SoleToJointView } from "./sole-to-joint-view";

test("it renders sole-to-joint start view", () => {
  render(<SoleToJointView />, {
    url: "/processes/:entityType/:id/sole-to-joint/start",
    path: "/processes/:entityType/:id/:process/:processKey",
  });
  screen.getByText(locale.processes.soleToJoint.title);
});

test("it renders a 404 if route not found", () => {
  render(<SoleToJointView />, {
    url: "/processes/:entityType/:id/sole-to-joint/unknown-path",
    path: "/processes/:entityType/:id/:process/:processKey/",
  });
  screen.getByText("404");
});
