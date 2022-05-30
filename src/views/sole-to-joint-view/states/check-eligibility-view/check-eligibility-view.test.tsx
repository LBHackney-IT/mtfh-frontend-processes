import React from "react";

import { getTenureV1, mockProcessV1, render, server } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale, processes } from "../../../../services";
import {
  mockBreachChecksFailedState,
  mockBreachChecksPassedState,
  mockDocumentsRequestedDes,
  mockManualChecksPassedState,
  mockProcessAutomatedChecksFailed,
  mockProcessAutomatedChecksPassed,
} from "../../../../test-utils";
import { CheckEliigibilityView } from "./check-eliigibility-view";

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
    <CheckEliigibilityView
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
    <CheckEliigibilityView
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
    <CheckEliigibilityView
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
    <CheckEliigibilityView
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
    <CheckEliigibilityView
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

test("it renders CheckEligibility for state=BreachChecksFailed", async () => {
  furtherEligibilitySubmitted = true;
  render(
    <CheckEliigibilityView
      processConfig={processes.soletojoint}
      process={mockBreachChecksFailedState}
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
    screen.findByText("Failed breach of tenure check:"),
  ).resolves.toBeInTheDocument();
});

test("it renders CheckEligibility for state=BreachChecksPassed", async () => {
  furtherEligibilitySubmitted = true;
  render(
    <CheckEliigibilityView
      processConfig={processes.soletojoint}
      process={mockBreachChecksPassedState}
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
    screen.queryByText(locale.views.checkEligibility.autoCheckIntro),
  ).not.toBeInTheDocument();
  await expect(screen.queryByText("Eligibility checks passed")).toBeInTheDocument();
  await expect(screen.findByText("Suporting documents")).resolves.toBeInTheDocument();
});

test("it renders CheckEligibility for state=DocumentsRequestedDes", async () => {
  furtherEligibilitySubmitted = true;
  render(
    <CheckEliigibilityView
      processConfig={processes.soletojoint}
      process={mockDocumentsRequestedDes}
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
    screen.findByText(locale.views.reviewDocuments.passedChecks, {
      exact: true,
    }),
  ).resolves.toBeInTheDocument();
});

test("it renders an error if tenure details can't be fetched", async () => {
  server.use(getTenureV1("error", 500));
  render(
    <CheckEliigibilityView
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
