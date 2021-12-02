import { mockActiveTenureV1, render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { menu, processes } from "../../services";
import { ProcessMenu } from "./process-menu";

import { $configuration } from "@mtfh/common/lib/configuration";

test("it renders legacy process list", async () => {
  const { container } = render(
    <ProcessMenu id={mockActiveTenureV1.id} entityType="tenure" />,
  );
  expect(container).toMatchSnapshot();
});

describe("feature toggle on", () => {
  beforeEach(() => {
    const features = $configuration.getValue();
    $configuration.next({
      MMH: {
        ...features.MMH,
        featureToggles: { EnhancedProcessMenu: true },
      },
    });
  });

  test("it renders expanded process list and redirects to process on click", async () => {
    render(<ProcessMenu id={mockActiveTenureV1.id} entityType="tenure" />);
    const input = screen.getByText(menu[0].label);
    userEvent.click(input);

    const processLink = await screen.findByText(processes.soleToJoint.title);

    expect(processLink).toBeInTheDocument();

    processLink.click();

    expect(window.location.pathname).toContain("/processes/sole-to-joint");
  });

  test("it opens an external link in a new tab", async () => {
    render(<ProcessMenu id={mockActiveTenureV1.id} entityType="tenure" />);

    const processLink = screen.getByText(menu[2].label);

    expect(processLink).toHaveAttribute("href", `${menu[2].link}`);
    expect(processLink).toHaveAttribute("target", "_blank");
  });
});
