import {
  getContactDetailsV2,
  mockContactDetailsV2,
  mockProcessV1,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../../services";
import { ReviewApplicationView } from "../review-application-view/review-application-view";

let submitted = false;
let closeCase = false;
const setSubmitted = () => {};
const setCloseCase = () => {};

describe("tenure-investigation-view", () => {
  beforeEach(() => {
    jest.resetModules();
    submitted = false;
    closeCase = false;
  });

  test("it renders ReviewApplication view correctly for ApplicationSubmitted state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
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
      screen.findByText(locale.views.tenureInvestigation.tenureInvestigationCompleted, {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it enables buttons when checkbox is checked", async () => {
    render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
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

    const approve = screen.getByText(locale.views.tenureInvestigation.approve);
    const appointment = screen.getByText(locale.views.tenureInvestigation.appointment);
    const decline = screen.getByText(locale.views.tenureInvestigation.decline);
    await userEvent.click(
      screen.getByLabelText(
        locale.views.tenureInvestigation.tenureInvestigationCompleted,
      ),
    );
    expect(approve).toBeEnabled();
    expect(appointment).toBeEnabled();
    expect(decline).toBeEnabled();
    await userEvent.click(approve);
    await userEvent.click(appointment);
    await userEvent.click(decline);
  });

  test("it renders error if submit fails", async () => {
    server.use(patchProcessV1(null, 500));
    render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
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
    await userEvent.click(
      screen.getByLabelText(
        locale.views.tenureInvestigation.tenureInvestigationCompleted,
      ),
    );
    await userEvent.click(screen.getByText(locale.views.tenureInvestigation.approve));
    await expect(
      screen.findByText("There was a problem with completing the action", {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
  });
});
