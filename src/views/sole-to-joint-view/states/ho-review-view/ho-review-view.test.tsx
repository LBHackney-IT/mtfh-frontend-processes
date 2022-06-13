import {
  getContactDetailsV2,
  mockContactDetailsV2,
  mockProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";

import { locale, processes } from "../../../../services";
import { ReviewApplicationView } from "../review-application-view/review-application-view";

let submitted = false;
let closeCase = false;
const setSubmitted = () => {};
const setCloseCase = () => {};

describe("ho-review-view", () => {
  beforeEach(() => {
    jest.resetModules();
    submitted = false;
    closeCase = false;
  });

  test("it renders ReviewApplication view correctly for HOApprovalPassed state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "HOApprovalPassed" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await expect(
      screen.findByText(locale.views.tenureInvestigation.mustMakeAppointment, {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
