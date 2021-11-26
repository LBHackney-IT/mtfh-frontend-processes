import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale } from "../../services";
import { ProcessesMenuView, menuItems } from "./processes-menu-view";

import { $configuration } from "@mtfh/common/lib/configuration";

test("it renders processes menu view correctly", () => {
  const { container } = render(<ProcessesMenuView />);
  expect(screen.getByText(locale.backButton)).toBeInTheDocument();
  expect(screen.getByText(locale.title)).toBeInTheDocument();
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

  test("it renders expanded process list", async () => {
    render(<ProcessesMenuView />);
    const input = screen.getByText(locale.menu.menuItems.changeToTenancy);
    userEvent.click(input);

    const processLink = await screen.findByText(locale.processes.soleToJoint.title);

    expect(processLink).toBeInTheDocument();
  });

  test("it opens an external link in a new tab", async () => {
    global.open = jest.fn();
    render(<ProcessesMenuView />);
    const input = screen.getByText(locale.menu.menuItems.findLegalReferral);
    userEvent.click(input);
    expect(global.open).toBeCalledWith(menuItems[2].link, "_blank");
  });
});
