import React from "react";

import {
  getContactDetailsV2,
  mockContactDetailsV2,
  mockProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";

import { locale, processes } from "../../../../services";
import { ReviewApplicationView } from "../../sole-to-joint-view/states/review-application-view/review-application-view";

describe("ho-review-failed-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders ReviewApplication view correctly for HOApprovalFailed state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          processName: "soletojoint",
          currentState: {
            ...mockProcessV1.currentState,
            state: "HOApprovalFailed",
            processData: {
              formData: {
                reason: "Test",
              },
              documents: [],
            },
          },
        }}
        mutate={() => {}}
        optional={{}}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await expect(
      screen.findByText(locale.views.hoReviewView.hoOutcome("Decline")),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
