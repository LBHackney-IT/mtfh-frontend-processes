import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { ProcessesMenuView } from "./processes-menu-view";

test("it renders processes menu view correctly", () => {
  const { container } = render(<ProcessesMenuView />);
  expect(screen.getByText(locale.backButton));
  expect(screen.getByText(locale.title));
  expect(container).toMatchSnapshot();
});
