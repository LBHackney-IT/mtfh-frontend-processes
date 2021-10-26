import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import App from "./app";

describe("<App />", () => {
  test("it renders correctly", () => {
    render(<App />, { url: "/processes" });
    expect(screen.getAllByText("@mtfh/processes"));
  });
});
