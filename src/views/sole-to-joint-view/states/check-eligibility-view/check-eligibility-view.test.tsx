import React from "react";

import { getTenureV1, render, server } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale, processes } from "../../../../services";
import {
  mockBreachChecksFailedState,
  mockBreachChecksPassedState,
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
  await expect(
    screen.queryByText("Passed automatic eligibility checks"),
  ).toBeInTheDocument();
  await expect(screen.findByText("Suporting documents")).resolves.toBeInTheDocument();
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
