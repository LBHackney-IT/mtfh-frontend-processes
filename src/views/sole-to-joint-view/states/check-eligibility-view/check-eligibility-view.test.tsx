import React from "react";

import {
  getReferenceDataV1,
  getTenureV1,
  mockProcessV1,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../services";
import {
  mockProcessAutomatedChecksFailed,
  mockProcessAutomatedChecksPassed,
} from "../../../../test-utils";
import { CheckEligibilityView } from "./check-eligibility-view";

import * as processV1 from "@mtfh/common/lib/api/process/v1/service";
import commonLocale from "@mtfh/common/lib/locale";

let submitted = false;
const setSubmitted = jest.fn();

beforeEach(() => {
  submitted = false;
});

const url = "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735";
const path = "/processes/soletojoint/:processId";
const options = {
  url,
  path,
};

test("it renders CheckEligibility passed checks view correctly", async () => {
  server.use(getReferenceDataV1({}, 200));
  const { container } = render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessAutomatedChecksPassed}
      mutate={() => {}}
      optional={{ submitted, setSubmitted }}
    />,
    options,
  );
  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, {
      exact: false,
    }),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.autoCheckIntro),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.passedChecks),
  ).resolves.toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test("it enables Next button when all required fields are selected", async () => {
  const editProcessSpy = jest.spyOn(processV1, "editProcess");
  server.use(patchProcessV1(mockProcessV1, 200));
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessAutomatedChecksPassed}
      mutate={() => {}}
      optional={{ submitted, setSubmitted }}
    />,
    options,
  );
  const next = await screen.findByText("Next");
  expect(next).toBeDisabled();
  await selectRadios(screen);
  expect(next).toBeEnabled();
  await userEvent.click(next);
  expect(editProcessSpy).toBeCalled();
});

test("it displays error when submit fails", async () => {
  server.use(patchProcessV1("error", 500));
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessAutomatedChecksPassed}
      mutate={() => {}}
      optional={{ submitted, setSubmitted }}
    />,
    options,
  );
  const next = await screen.findByText("Next");
  expect(next).toBeDisabled();
  await selectRadios(screen);
  expect(next).toBeEnabled();
  await userEvent.click(next);
  await expect(
    screen.findByText(commonLocale.components.statusErrorSummary.statusTitle(-1)),
  ).resolves.toBeInTheDocument();
});

test("it renders CheckEligibility correctly if there is an incoming tenant", async () => {
  const incomingTenantId = "incomingTenantId";
  const fullName = "IncomingTenant Test";
  const tenure = {
    householdMembers: [
      {
        fullName,
        id: incomingTenantId,
        isResponsible: true,
      },
    ],
  };
  server.use(getTenureV1(tenure));
  const process = {
    ...mockProcessV1,
    currentState: { ...mockProcessV1.currentState, state: "AutomatedChecksPassed" },
  };
  process.currentState.processData.formData.incomingTenantId = incomingTenantId;
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={process}
      mutate={() => {}}
      optional={{ submitted, setSubmitted }}
    />,
    options,
  );
  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, {
      exact: false,
    }),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.autoCheckIntro),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.passedChecks),
  ).resolves.toBeInTheDocument();
  await expect(screen.findByText(`adding ${fullName}`)).resolves.toBeInTheDocument();
});

test("it renders CheckEligibility failed checks view correctly", async () => {
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessAutomatedChecksFailed}
      mutate={() => {}}
      optional={{ submitted, setSubmitted }}
    />,
    options,
  );
  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, {
      exact: false,
    }),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.autoCheckIntro),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.failedChecks),
  ).resolves.toBeInTheDocument();
});

test("it renders CheckEligibility failed checks view correctly for process closed state", async () => {
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={{
        ...mockProcessV1,
        currentState: { ...mockProcessV1.currentState, state: "ProcessClosed" },
        previousStates: [
          { ...mockProcessV1.currentState, state: "AutomatedChecksFailed" },
        ],
      }}
      mutate={() => {}}
      optional={{ submitted, setSubmitted }}
    />,
    options,
  );
  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, {
      exact: false,
    }),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.autoCheckIntro),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.checkEligibility.failedChecks),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.views.closeProcess.confirmationText),
  ).resolves.toBeInTheDocument();
});

test("it renders an error if tenure details can't be fetched", async () => {
  server.use(getTenureV1("error", 500));
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessAutomatedChecksPassed}
      mutate={() => {}}
      optional={{ submitted, setSubmitted }}
    />,
    options,
  );

  await expect(
    screen.findByText(locale.errors.unableToFetchRecord),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFetchRecordDescription),
  ).resolves.toBeInTheDocument();
});

const selectRadios = async (screen) => {
  await userEvent.click(screen.getAllByRole("radio")[0]);
  await userEvent.click(screen.getAllByRole("radio")[3]);
  await userEvent.click(screen.getAllByRole("radio")[5]);
  await userEvent.click(screen.getAllByRole("radio")[7]);
  await userEvent.click(screen.getAllByRole("radio")[9]);
  await userEvent.click(screen.getAllByRole("radio")[11]);
  await userEvent.click(screen.getAllByRole("radio")[13]);
};
