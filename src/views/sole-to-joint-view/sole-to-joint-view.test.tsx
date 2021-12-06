import { getProcessV1, mockProcessV1, render, server } from "@hackney/mtfh-test-utils";
import { screen, within } from "@testing-library/react";

import { locale } from "../../services";
import { SoleToJointView } from "./sole-to-joint-view";

const mockProcessSelectTenants = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, stateName: "SelectTenants" },
};

const mockProcessCheckEligibility = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, stateName: "CheckEligibility" },
};

const mockProcessInvalidState = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, stateName: "InvalidState" },
};

test("it renders soletojoint view for SelectTenants", async () => {
  server.use(getProcessV1(mockProcessSelectTenants));
  render(<SoleToJointView />, {
    url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
    path: "/processes/soletojoint/:processId",
  });

  await expect(
    screen.findByTestId("soletojoint-SelectTenants"),
  ).resolves.toBeInTheDocument();

  const stepper = await screen.findByTestId("mtfh-stepper-sole-to-joint");
  const steps = within(stepper).getAllByRole("listitem");
  expect(steps[0].className).toContain("active");
  expect(steps[1].className).not.toContain("active");
});

test("it renders stepper component", async () => {
  server.use(getProcessV1(mockProcessSelectTenants));
  render(<SoleToJointView />, {
    url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
    path: "/processes/soletojoint/:processId",
  });

  const stepper = await screen.findByTestId("mtfh-stepper-sole-to-joint");
  const steps = within(stepper).getAllByRole("listitem");
  expect(steps).toMatchSnapshot();
});

test("it renders soletojoint view for CheckEligibility", async () => {
  server.use(getProcessV1(mockProcessCheckEligibility));
  render(<SoleToJointView />, {
    url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
    path: "/processes/soletojoint/:processId",
  });
  await expect(
    screen.findByTestId("soletojoint-CheckEligibility"),
  ).resolves.toBeInTheDocument();

  const stepper = await screen.findByTestId("mtfh-stepper-sole-to-joint");
  const steps = within(stepper).getAllByRole("listitem");
  expect(steps[0].className).not.toContain("active");
  expect(steps[1].className).toContain("active");
});

test("it renders an error if an invalid state is returned", async () => {
  server.use(getProcessV1(mockProcessInvalidState));
  render(<SoleToJointView />, {
    url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
    path: "/processes/soletojoint/:processId",
  });

  await expect(
    screen.findByText(locale.errors.unableToFindState),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFindStateDescription),
  ).resolves.toBeInTheDocument();
});

test("it renders an error if tenure details can't be fetched", async () => {
  server.use(getProcessV1("error", 500));
  render(<SoleToJointView />, {
    url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
    path: "/processes/soletojoint/:processId",
  });

  await expect(
    screen.findByText(locale.errors.unableToFetchRecord),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFetchRecordDescription),
  ).resolves.toBeInTheDocument();
});
