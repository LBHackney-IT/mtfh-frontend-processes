import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { ProcessesMenuView } from "./processes-menu-view";

test("it renders processes menu view correctly", () => {
  const { container } = render(<ProcessesMenuView />);
  expect(screen.getByText(locale.backButton)).toBeInTheDocument();
  expect(screen.getByText(locale.title)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});
