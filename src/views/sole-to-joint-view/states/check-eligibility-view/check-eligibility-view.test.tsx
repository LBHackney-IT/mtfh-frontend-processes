import React from "react";

import { getTenureV1, mockProcessV1, render, server } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale, processes } from "../../../../services";
import {
  mockManualChecksPassedState,
  mockProcessAutomatedChecksFailed,
  mockProcessAutomatedChecksPassed,
} from "../../../../test-utils";
import { CheckEligibilityView } from "./check-eligibility-view";

let furtherEligibilitySubmitted = false;
const setFurtherEligibilitySubmitted = () => {};

beforeEach(() => {
  furtherEligibilitySubmitted = false;
});

const url = "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735";
const path = "/processes/soletojoint/:processId";
const options = {
  url,
  path,
};

test("it renders CheckEligibility passed checks view correctly", async () => {
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessAutomatedChecksPassed}
      mutate={() => {}}
      optional={{ furtherEligibilitySubmitted, setFurtherEligibilitySubmitted }}
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
      optional={{ furtherEligibilitySubmitted, setFurtherEligibilitySubmitted }}
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
      optional={{ furtherEligibilitySubmitted, setFurtherEligibilitySubmitted }}
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

test("it renders CheckEligibility for state=ManualChecksPassed, furtherEligibilitySubmitted=false", async () => {
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockManualChecksPassedState}
      mutate={() => {}}
      optional={{ furtherEligibilitySubmitted, setFurtherEligibilitySubmitted }}
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
  await expect(screen.findByText("Breach of tenure")).resolves.toBeInTheDocument();
});

test("it renders CheckEligibility for state=ManualChecksPassed, furtherEligibilitySubmitted=true", async () => {
  furtherEligibilitySubmitted = true;
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockManualChecksPassedState}
      mutate={() => {}}
      optional={{ furtherEligibilitySubmitted, setFurtherEligibilitySubmitted }}
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
  await expect(screen.findByText("Next Steps:")).resolves.toBeInTheDocument();
});

test("it renders an error if tenure details can't be fetched", async () => {
  server.use(getTenureV1("error", 500));
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessAutomatedChecksPassed}
      mutate={() => {}}
      optional={{ furtherEligibilitySubmitted, setFurtherEligibilitySubmitted }}
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
