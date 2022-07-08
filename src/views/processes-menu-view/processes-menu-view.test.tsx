import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { ProcessesMenuView } from "./processes-menu-view";

import { $configuration } from "@mtfh/common/lib/configuration";

test("it renders processes menu view correctly", () => {
  const { container } = render(<ProcessesMenuView targetType="tenure" />, {
    url: "/processes/tenure/1234",
    path: "/processes/:targetType/:id",
  });
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

  test("it renders processes menu view correctly", () => {
    const { container } = render(<ProcessesMenuView targetType="tenure" />, {
      url: "/processes/tenure/1234",
      path: "/processes/:targetType/:id",
    });
    expect(screen.getByText(locale.backButton)).toBeInTheDocument();
    expect(screen.getByText(locale.title)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
