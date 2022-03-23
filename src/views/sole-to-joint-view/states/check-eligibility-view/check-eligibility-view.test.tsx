import { getTenureV1, render, server } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale, processes } from "../../../../services";
import {
  mockProcessAutomatedChecksFailed,
  mockProcessAutomatedChecksPassed,
} from "../../../../test-utils";
import { CheckEligibilityView } from "./check-eliigibility-view";

test("it renders CheckEligibility passed checks view correctly", async () => {
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessAutomatedChecksPassed}
      mutate={() => {}}
    />,
    {
      url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
      path: "/processes/soletojoint/:processId",
    },
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
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessAutomatedChecksFailed}
      mutate={() => {}}
    />,
    {
      url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
      path: "/processes/soletojoint/:processId",
    },
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

test("it renders an error if tenure details can't be fetched", async () => {
  server.use(getTenureV1("error", 500));
  render(
    <CheckEligibilityView
      processConfig={processes.soletojoint}
      process={mockProcessAutomatedChecksPassed}
      mutate={() => {}}
    />,
    {
      url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
      path: "/processes/soletojoint/:processId",
    },
  );

  await expect(
    screen.findByText(locale.errors.unableToFetchRecord),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFetchRecordDescription),
  ).resolves.toBeInTheDocument();
});
