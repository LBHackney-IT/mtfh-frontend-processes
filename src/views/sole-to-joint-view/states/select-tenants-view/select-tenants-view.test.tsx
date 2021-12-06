import {
  getTenureV1,
  mockActiveTenureV1,
  mockProcessV1,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import { locale, processes } from "../../../../services";
import { SelectTenantsView } from "./select-tenants-view";

const mockProcessSelectTenants = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, stateName: "SelectTenants" },
};

describe("select-tenants-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders SelectTenantsView correctly", async () => {
    render(
      <SelectTenantsView
        processConfig={processes.soletojoint}
        process={mockProcessSelectTenants}
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
  });

  test("it renders an error if tenure details can't be fetched", async () => {
    server.use(getTenureV1("error", 500));
    render(
      <SelectTenantsView
        processConfig={processes.soletojoint}
        process={mockProcessSelectTenants}
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

  test("it enables form once radio is selected", async () => {
    render(
      <SelectTenantsView
        processConfig={processes.soletojoint}
        process={mockProcessSelectTenants}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );

    const nextButton = await screen.findByText(locale.next);

    expect(nextButton).toBeDisabled();

    const radio = screen.getByLabelText(mockActiveTenureV1.householdMembers[0].fullName);

    fireEvent.click(radio);

    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
  });

  test("it displays an error if there's an issue with patching", async () => {
    server.use(patchProcessV1("error", 500));
    render(
      <SelectTenantsView
        processConfig={processes.soletojoint}
        process={mockProcessSelectTenants}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );

    const nextButton = await screen.findByText(locale.next);

    expect(nextButton).toBeDisabled();

    const radio = screen.getByLabelText(mockActiveTenureV1.householdMembers[0].fullName);

    fireEvent.click(radio);

    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
      nextButton.click();
    });

    await expect(
      screen.findByText("There was a problem with completing the action"),
    ).resolves.toBeInTheDocument();
  });
});
