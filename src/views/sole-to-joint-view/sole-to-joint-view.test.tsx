import React, { useState } from "react";

import {
  getContactDetailsV2,
  getProcessV1,
  mockContactDetailsV2,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, within } from "@testing-library/react";

import { locale } from "../../services";
import {
  mockBreachChecksFailedState,
  mockBreachChecksPassedState,
  mockDocumentsRequestedDes,
  mockManualChecksPassedState,
  mockProcessAutomatedChecksFailed,
  mockProcessAutomatedChecksPassed,
  mockProcessInvalidState,
  mockProcessSelectTenants,
} from "../../test-utils";
import { SoleToJointView } from "./sole-to-joint-view";

jest.mock("react", () => ({
  ...jest.requireActual<any>("react"),
  useState: jest.fn(),
}));

const useStateMock: jest.Mock<typeof useState> = useState as never;

const options = {
  url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/soletojoint/:processId",
};

test("it renders soletojoint view for SelectTenants", async () => {
  server.use(getProcessV1(mockProcessSelectTenants));
  // @ts-ignore
  useStateMock.mockImplementation(() => [false, jest.fn()]);
  render(<SoleToJointView />, options);

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
  // @ts-ignore
  useStateMock.mockImplementation(() => [false, jest.fn()]);
  render(<SoleToJointView />, options);

  const stepper = await screen.findByTestId("mtfh-stepper-sole-to-joint");
  const steps = within(stepper).getAllByRole("listitem");
  expect(steps).toMatchSnapshot();
});

test("it renders sidebar buttons", async () => {
  server.use(getProcessV1(mockProcessSelectTenants));
  // @ts-ignore
  useStateMock.mockImplementation(() => [false, jest.fn()]);
  render(<SoleToJointView />, options);

  const { soleToJoint } = locale.views;
  await Promise.all(
    Object.keys(soleToJoint.actions).map(async (key) => {
      const button = await screen.findByText(soleToJoint.actions[key]);
      expect(button.className).toContain("secondary");
    }),
  );
});

test("it renders soletojoint view for AutomatedChecksFailed", async () => {
  server.use(getProcessV1(mockProcessAutomatedChecksFailed));
  // @ts-ignore
  useStateMock.mockImplementation(() => [false, jest.fn()]);
  render(<SoleToJointView />, options);
  await expect(
    screen.findByTestId("soletojoint-CheckEligibility"),
  ).resolves.toBeInTheDocument();

  const stepper = await screen.findByTestId("mtfh-stepper-sole-to-joint");
  const steps = within(stepper).getAllByRole("listitem");
  expect(steps[0].className).not.toContain("active");
  expect(steps[1].className).toContain("active");
});

test("it renders soletojoint view for AutomatedChecksPassed", async () => {
  server.use(getProcessV1(mockProcessAutomatedChecksPassed));
  // @ts-ignore
  useStateMock.mockImplementation(() => [false, jest.fn()]);
  render(<SoleToJointView />, options);
  await expect(
    screen.findByTestId("soletojoint-CheckEligibility"),
  ).resolves.toBeInTheDocument();

  const stepper = await screen.findByTestId("mtfh-stepper-sole-to-joint");
  const steps = within(stepper).getAllByRole("listitem");
  expect(steps[0].className).not.toContain("active");
  expect(steps[1].className).toContain("active");
});

test("it renders soletojoint view for state=ManualChecksPassed, furtherEligibilitySubmitted=false", async () => {
  server.use(getProcessV1(mockManualChecksPassedState));
  // @ts-ignore
  useStateMock.mockImplementation(() => [false, jest.fn()]);
  render(<SoleToJointView />, options);
  await expect(
    screen.findByTestId("soletojoint-CheckEligibility"),
  ).resolves.toBeInTheDocument();

  const stepper = await screen.findByTestId("mtfh-stepper-sole-to-joint");
  const steps = within(stepper).getAllByRole("listitem");
  expect(steps[0].className).toContain("active");
  expect(steps[0].textContent).toContain("Breach of tenure check");
});

test("it renders soletojoint view for state=ManualChecksPassed, furtherEligibilitySubmitted=true", async () => {
  server.use(getProcessV1(mockManualChecksPassedState));
  // @ts-ignore
  useStateMock.mockImplementation(() => [true, jest.fn()]);
  render(<SoleToJointView />, options);
  await expect(
    screen.findByTestId("soletojoint-CheckEligibility"),
  ).resolves.toBeInTheDocument();

  const stepper = await screen.findByTestId("mtfh-stepper-sole-to-joint");
  const steps = within(stepper).getAllByRole("listitem");
  expect(steps[2].className).toContain("active");
  expect(steps[2].textContent).toContain("Finish");
});

test("it renders soletojoint view for state=BreachChecksPassed", async () => {
  server.use(getProcessV1(mockBreachChecksPassedState));
  server.use(getContactDetailsV2(mockContactDetailsV2));
  // @ts-ignore
  useStateMock.mockImplementation(() => [false, jest.fn()]);
  render(<SoleToJointView />, options);
  await expect(
    screen.findByTestId("soletojoint-RequestDocuments"),
  ).resolves.toBeInTheDocument();

  const stepper = await screen.findByTestId("mtfh-stepper-sole-to-joint");
  const steps = within(stepper).getAllByRole("listitem");
  expect(steps[1].className).toContain("active");
  expect(steps[1].textContent).toContain("Request Documents");
  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, {
      exact: false,
    }),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.queryByText(locale.views.checkEligibility.autoCheckIntro),
  ).not.toBeInTheDocument();
  await expect(screen.queryByText("Eligibility checks passed")).toBeInTheDocument();
  await expect(screen.findByText("Supporting documents")).resolves.toBeInTheDocument();
});

test("it renders soletojoint for state=BreachChecksFailed", async () => {
  server.use(getProcessV1(mockBreachChecksFailedState));
  // @ts-ignore
  useStateMock.mockImplementation(() => [false, jest.fn()]);
  render(<SoleToJointView />, options);

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

test("it renders an error if an invalid state is returned", async () => {
  server.use(getProcessV1(mockProcessInvalidState));
  render(<SoleToJointView />, options);

  await expect(
    screen.findByText(locale.errors.unableToFindState),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFindStateDescription),
  ).resolves.toBeInTheDocument();
});

test("it renders an error if tenure details can't be fetched", async () => {
  server.use(getProcessV1("error", 500));
  render(<SoleToJointView />, options);

  await expect(
    screen.findByText(locale.errors.unableToFetchRecord),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFetchRecordDescription),
  ).resolves.toBeInTheDocument();
});

test("it renders soletojoint for state=DocumentsRequestedDes", async () => {
  server.use(getProcessV1(mockDocumentsRequestedDes));
  // @ts-ignore
  useStateMock.mockImplementation(() => [false, jest.fn()]);
  render(<SoleToJointView />, options);
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
