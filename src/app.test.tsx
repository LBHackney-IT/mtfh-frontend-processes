import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./app";
import { locale } from "./services";

test("it shows invalid if no id in url", () => {
  render(<App />, { url: "/", path: "/" });
  screen.getByText("404");
});

test("renders the process menu view and contains correct back button path", () => {
  render(<App />, { url: "/processes/person/1234", path: "/" });
  userEvent.click(screen.getByText(locale.backButton));
  expect(window.location.pathname).toContain(`/person/1234`);
});
