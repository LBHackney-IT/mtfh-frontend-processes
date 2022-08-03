import { mockProcessV1, patchProcessV1, render, server } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale } from "../../../../services";
import { Trigger } from "../../../../services/processes/types";
import { Recommendation } from "../../../../types";
import { TenureInvestigationForm } from "./tenure-investigation-form";

import * as processV1 from "@mtfh/common/lib/api/process/v1/service";
import * as errorMessages from "@mtfh/common/lib/hooks/use-error-codes";

const options = {
  url: "/processes/changeofname/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/:processName/:processId",
};

let setGlobalErrorStub;
let mutate;

describe("tenure-investigation-form", () => {
  beforeEach(() => {
    jest.resetModules();
    setGlobalErrorStub = jest.fn();
    mutate = jest.fn();
  });

  test("it renders TenureInvestigation view correctly", async () => {
    const editProcessSpy = jest.spyOn(processV1, "editProcess");
    jest.spyOn(errorMessages, "useErrorCodes").mockReturnValue({});
    const { container } = render(
      <TenureInvestigationForm
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={mutate}
      />,
      options,
    );
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

  test("it renders error if submit fails", async () => {
    server.use(patchProcessV1(null, 500));
    render(
      <TenureInvestigationForm
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "ApplicationSubmitted" },
        }}
        mutate={mutate}
        setGlobalError={setGlobalErrorStub}
      />,
      options,
    );
    await expect(
      screen.findByText(Recommendation.Appointment),
    ).resolves.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText(Recommendation.Appointment));
    await userEvent.click(
      screen.getByLabelText(
        locale.views.tenureInvestigation.tenureInvestigationCompleted,
      ),
    );
    await userEvent.click(screen.getByText(locale.confirm));

    await waitFor(() => expect(setGlobalErrorStub).toHaveBeenCalled());

    expect(setGlobalErrorStub).toBeCalledWith(500);
  });
});
