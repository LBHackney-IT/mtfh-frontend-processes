import {
  getAssetV1,
  getPersonV1,
  getTenureV1,
  mockActiveTenureV1,
  mockAssetV1,
  mockPersonV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";

import { locale } from "../../services";
import { EntitySummary } from "./entity-summary";

test("it renders tenure summary details", async () => {
  render(<EntitySummary id={mockActiveTenureV1.id} type="tenure" />, {
    url: `/processes/sole-to-joint/start/tenure/${mockActiveTenureV1.id}`,
    path: "/processes/:processName/start/:entityType/:entityId",
  });

  await expect(
    screen.findByText(locale.components.entitySummary.tenurePaymentRef, { exact: false }),
  ).resolves.toBeInTheDocument();

  await expect(
    screen.findByText(mockActiveTenureV1.paymentReference, { exact: false }),
  ).resolves.toBeInTheDocument();

  await expect(
    screen.findByText(mockActiveTenureV1?.tenuredAsset?.fullAddress, { exact: false }),
  ).resolves.toBeInTheDocument();
});

test("it renders an error if tenure details can't be fetched", async () => {
  server.use(getTenureV1("error", 500));
  render(<EntitySummary id={mockActiveTenureV1.id} type="tenure" />, {
    url: `/processes/sole-to-joint/start/tenure/${mockActiveTenureV1.id}`,
    path: "/processes/:processName/start/:entityType/:entityId",
  });

  await expect(
    screen.findByText(locale.errors.unableToFetchRecord),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFetchRecordDescription),
  ).resolves.toBeInTheDocument();
});

test("it renders person summary details", async () => {
  render(<EntitySummary id={mockPersonV1.id} type="person" />, {
    url: `/processes/sole-to-joint/start/person/${mockPersonV1.id}`,
    path: "/processes/:processName/start/:entityType/:entityId",
  });

  await expect(
    screen.findByText(mockPersonV1?.firstName, { exact: false }),
  ).resolves.toBeInTheDocument();

  await expect(
    screen.findByText(mockPersonV1?.surname, { exact: false }),
  ).resolves.toBeInTheDocument();
});

test("it renders an error if person details can't be fetched", async () => {
  server.use(getPersonV1("error", 500));
  render(<EntitySummary id={mockPersonV1.id} type="person" />, {
    url: `/processes/sole-to-joint/start/person/${mockPersonV1.id}`,
    path: "/processes/:processName/start/:entityType/:entityId",
  });

  await expect(
    screen.findByText(locale.errors.unableToFetchRecord),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFetchRecordDescription),
  ).resolves.toBeInTheDocument();
});

test("it renders property summary details", async () => {
  render(<EntitySummary id={mockAssetV1.id} type="property" />, {
    url: `/processes/sole-to-joint/start/property/${mockAssetV1.id}`,
    path: "/processes/:processName/start/:entityType/:entityId",
  });
  await expect(
    screen.findByText(locale.components.entitySummary.address(mockAssetV1.assetAddress), {
      exact: false,
    }),
  ).resolves.toBeInTheDocument();
});

test("it renders an error if property details can't be fetched", async () => {
  server.use(getAssetV1("error", 500));
  render(<EntitySummary id={mockAssetV1.id} type="property" />, {
    url: `/processes/sole-to-joint/start/property/${mockAssetV1.id}`,
    path: "/processes/:processName/start/:entityType/:entityId",
  });

  await expect(
    screen.findByText(locale.errors.unableToFetchRecord),
  ).resolves.toBeInTheDocument();
  await expect(
    screen.findByText(locale.errors.unableToFetchRecordDescription),
  ).resolves.toBeInTheDocument();
});
