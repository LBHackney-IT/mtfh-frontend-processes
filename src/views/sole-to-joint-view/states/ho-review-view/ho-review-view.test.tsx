import React from "react";

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

import { locale, processes } from "../../../../services";
import { typeDateTime } from "../../../../test-utils";
import { ReviewApplicationView } from "../review-application-view/review-application-view";
import { HoReviewView } from "./ho-review-view";

import * as processV1 from "@mtfh/common/lib/api/process/v1/service";
import * as errorMessages from "@mtfh/common/lib/hooks/use-error-codes";

let submitted = false;
let closeCase = false;
const setSubmitted = () => {};
const setCloseCase = () => {};

describe("ho-review-view", () => {
  beforeEach(() => {
    jest.resetModules();
    submitted = false;
    closeCase = false;
    jest.spyOn(errorMessages, "useErrorCodes").mockReturnValue({});
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
    await expect(screen.findByText("Date")).resolves.toBeInTheDocument();
    await expect(screen.findByText("Time")).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it renders ReviewApplication view correctly for TenureInvestigationPassed state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: "TenureInvestigationPassed",
          },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText("approve application", { exact: false }),
    ).resolves.toBeInTheDocument();
  });

  test("it renders ReviewApplication view correctly for TenureInvestigationFailed state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: "TenureInvestigationFailed",
          },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText("decline application", { exact: false }),
    ).resolves.toBeInTheDocument();
  });

  test("it renders ReviewApplication view correctly for tenureInvestigationPassedWithInt state", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    render(
      <ReviewApplicationView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: "tenureInvestigationPassedWithInt",
          },
        }}
        mutate={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await expect(
      screen.findByText("Interview Applicant", { exact: false }),
    ).resolves.toBeInTheDocument();
  });

  test("it shows/hides fields on radio button clicks", async () => {
    server.use(getContactDetailsV2(mockContactDetailsV2));
    render(
      <HoReviewView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: "TenureInvestigationFailed",
          },
        }}
        mutate={() => {}}
        setGlobalError={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    const appointmentRadio = screen.getByLabelText(
      locale.views.hoReviewView.makeAppointment,
      {
        exact: false,
      },
    );
    const reviewRadio = screen.getByText(locale.views.hoReviewView.passedForReview, {
      exact: false,
    });
    await expect(
      screen.queryByText(locale.views.hoReviewView.appointmentContactDetails),
    ).toBeNull();
    await userEvent.click(appointmentRadio);
    await expect(
      screen.findByText(locale.views.hoReviewView.appointmentContactDetails, {
        exact: false,
      }),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.queryByText(locale.views.hoReviewView.receivedDecision),
    ).toBeNull();
    await userEvent.click(reviewRadio);
    await expect(
      screen.findByText(locale.views.hoReviewView.receivedDecision),
    ).resolves.toBeInTheDocument();
    await userEvent.click(screen.getByText(locale.views.tenureInvestigation.approve));
  });

  test("it submits review", async () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, "useState");
    useStateSpy.mockImplementation(() => [false, setState]);
    const editProcessSpy = jest.spyOn(processV1, "editProcess");
    server.use(getContactDetailsV2(mockContactDetailsV2));
    server.use(patchProcessV1({}, 200));
    render(
      <HoReviewView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: "TenureInvestigationFailed",
          },
        }}
        mutate={() => {}}
        setGlobalError={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await userEvent.click(
      screen.getByLabelText(locale.views.hoReviewView.passedForReview, {
        exact: false,
      }),
    );
    await userEvent.click(
      screen.getByLabelText(locale.views.tenureInvestigation.approve),
    );
    await userEvent.type(
      screen.getByPlaceholderText(locale.views.hoReviewView.managersName),
      "test",
    );
    await userEvent.click(
      screen.getByText(locale.views.hoReviewView.confirmInstructionReceived),
    );
    await userEvent.click(screen.getByText(locale.confirm));
    expect(editProcessSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: { hoRecommendation: "approve", housingAreaManagerName: "test" },
        processTrigger: "HOApproval",
      }),
    );
  });

  test("it submits appointment", async () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, "useState");
    useStateSpy.mockImplementation(() => [false, setState]);
    const editProcessSpy = jest.spyOn(processV1, "editProcess");
    server.use(getContactDetailsV2(mockContactDetailsV2));
    server.use(patchProcessV1({}, 200));
    render(
      <HoReviewView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: "TenureInvestigationFailed",
          },
        }}
        mutate={() => {}}
        setGlobalError={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await userEvent.click(
      screen.getByLabelText(locale.views.hoReviewView.makeAppointment, {
        exact: false,
      }),
    );
    await typeDateTime(screen, userEvent, "2099");
    await userEvent.click(screen.getByText(locale.confirm));
    expect(editProcessSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        processTrigger: "ScheduleInterview",
      }),
    );
  });

  test("it submits reschedule appointment", async () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, "useState");
    useStateSpy.mockImplementation(() => [false, setState]);
    const editProcessSpy = jest.spyOn(processV1, "editProcess");
    server.use(getContactDetailsV2(mockContactDetailsV2));
    server.use(patchProcessV1({}, 200));
    render(
      <HoReviewView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: "InterviewScheduled",
            processData: {
              formData: {
                appointmentDateTime: "2010-10-12T08:59:00.000Z",
              },
              documents: [],
            },
          },
        }}
        mutate={() => {}}
        setGlobalError={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await userEvent.click(
      screen.getByLabelText(locale.views.hoReviewView.makeAppointment, {
        exact: false,
      }),
    );
    await typeDateTime(screen, userEvent, "2099");
    await userEvent.click(screen.getByText(locale.confirm));
    expect(editProcessSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        processTrigger: "RescheduleInterview",
      }),
    );
  });

  test("it submits schedule appointment date not passed", async () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, "useState");
    useStateSpy.mockImplementation(() => [false, setState]);
    const editProcessSpy = jest.spyOn(processV1, "editProcess");
    server.use(getContactDetailsV2(mockContactDetailsV2));
    server.use(patchProcessV1({}, 200));
    render(
      <HoReviewView
        processConfig={processes.soletojoint}
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: "InterviewScheduled",
            processData: {
              formData: {
                appointmentDateTime: "2099-10-12T08:59:00.000Z",
              },
              documents: [],
            },
          },
        }}
        mutate={() => {}}
        setGlobalError={() => {}}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    await userEvent.click(
      screen.getByLabelText(locale.views.hoReviewView.makeAppointment, {
        exact: false,
      }),
    );
    await typeDateTime(screen, userEvent, "2099");
    await userEvent.click(screen.getByText(locale.confirm));
    expect(editProcessSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        processTrigger: "",
      }),
    );
  });
});
