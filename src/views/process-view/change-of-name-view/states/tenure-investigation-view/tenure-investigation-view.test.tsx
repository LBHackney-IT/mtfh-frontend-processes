import {
  getContactDetailsV2,
  getReferenceDataV1,
  mockContactDetailsV2,
  mockProcessV1,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../../services";
import { Trigger } from "../../../../../services/processes/types";
import { Recommendation } from "../../../../../types";
import { TenureInvestigationView } from "./tenure-investigation-view";

import * as processV1 from "@mtfh/common/lib/api/process/v1/service";
import commonLocale from "@mtfh/common/lib/locale";

let submitted = false;
let closeCase = false;
const setSubmitted = jest.fn();
const setCloseCase = () => {};

const options = {
  url: "/processes/changeofname/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/:processName/:processId",
};

describe("tenure-investigation-view", () => {
  beforeEach(() => {
    jest.resetModules();
    submitted = false;
    closeCase = false;
  });

  test("it renders TenureInvestigation view correctly for ApplicationSubmitted state, submitted=false", async () => {
    const editProcessSpy = jest.spyOn(processV1, "editProcess");
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <TenureInvestigationView
        processConfig={processes.changeofname}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      options,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await userEvent.click(screen.getByLabelText(Recommendation.Appointment));
    await userEvent.click(
      screen.getByLabelText(
        locale.views.tenureInvestigation.tenureInvestigationCompleted,
      ),
    );
    await userEvent.click(screen.getByText(locale.confirm));
    expect(editProcessSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        processTrigger: Trigger.TenureInvestigation,
        formData: {
          tenureInvestigationRecommendation: Recommendation.Appointment.toLowerCase(),
        },
      }),
    );
    expect(container).toMatchSnapshot();
  });

  test("it renders TenureInvestigation view correctly for ApplicationSubmitted state, submitted=true", async () => {
    server.use(getReferenceDataV1({}, 200));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <TenureInvestigationView
        processConfig={processes.changeofname}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted: true, setSubmitted, closeCase, setCloseCase }}
      />,
      options,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    expect(container).toMatchSnapshot();
    await userEvent.click(screen.getByText("Continue"));
    expect(setSubmitted).toHaveBeenCalledWith(false);
  });

  test("it renders error if submit fails", async () => {
    server.use(patchProcessV1(null, 500));
    render(
      <TenureInvestigationView
        processConfig={processes.changeofname}
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      options,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    await userEvent.click(screen.getByLabelText(Recommendation.Appointment));
    await userEvent.click(
      screen.getByLabelText(
        locale.views.tenureInvestigation.tenureInvestigationCompleted,
      ),
    );
    await userEvent.click(screen.getByText(locale.confirm));
    await expect(
      screen.findByText(commonLocale.components.statusErrorSummary.statusTitle(500), {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
  });
});
