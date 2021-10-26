import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { ProcessesMenuView } from "./processes-menu-view";

test("it renders processes menu view correctly", () => {
  const { container } = render(<ProcessesMenuView />);
  screen.getByText(locale.backButton);
  screen.getByText(locale.title);
  expect(container).toMatchSnapshot();
});
