import { mockActiveTenureV1, render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { menu, processes } from "../../services";
import { ProcessMenu } from "./process-menu";

import * as assetV1 from "@mtfh/common/lib/api/asset/v1/service";
import { Asset } from "@mtfh/common/lib/api/asset/v1/types";
import * as tenureV1 from "@mtfh/common/lib/api/tenure/v1/service";
import { Tenure } from "@mtfh/common/lib/api/tenure/v1/types";
import { $configuration } from "@mtfh/common/lib/configuration";
import { AxiosSWRResponse } from "@mtfh/common/lib/http";

test("it renders legacy process list", async () => {
  const { container } = render(
    <ProcessMenu id={mockActiveTenureV1.id} targetType="tenure" />,
  );
  expect(container).toMatchSnapshot();
});

describe("feature toggle on", () => {
  beforeEach(() => {
    const features = $configuration.getValue();
    $configuration.next({
      MMH: {
        ...features.MMH,
        featureToggles: { EnhancedProcessMenu: true },
      },
    });
  });

  test("it renders expanded process list and redirects to process on click", async () => {
    render(<ProcessMenu id={mockActiveTenureV1.id} targetType="tenure" />);
    const input = screen.getByText(menu[0].label);
    userEvent.click(input);

    const processLink = await screen.findByText(processes.soletojoint.title);

    expect(processLink).toBeInTheDocument();

    processLink.click();

    expect(window.location.pathname).toContain("/processes/soletojoint");
  });

  test("it opens an external link in a new tab", async () => {
    render(<ProcessMenu id={mockActiveTenureV1.id} targetType="tenure" />);

    const processLink = screen.getByText(menu[2].label);

    expect(processLink).toHaveAttribute("href", `${menu[2].link}`);
    expect(processLink).toHaveAttribute("target", "_blank");
  });

  test("it only shows soletojoint for the specified targetType tenure", async () => {
    render(<ProcessMenu id={mockActiveTenureV1.id} targetType="tenure" />);

    expect(screen.queryByText(processes.soletojoint.title)).toBeInTheDocument();
  });

  test("it does not show soletojoint for the specified targetType property", async () => {
    render(<ProcessMenu id={mockActiveTenureV1.id} targetType="property" />);

    expect(screen.queryByText(processes.soletojoint.title)).not.toBeInTheDocument();
  });

  describe("prepopulate query", () => {
    test("Request a Legal referral has the correct query", () => {
      const tenure = {
        householdMembers: [
          {
            fullName: "Test0 Test",
            isResponsible: false,
          },
          {
            fullName: "Test1 Test",
            isResponsible: true,
          },
          {
            fullName: "Test2 Test",
            isResponsible: true,
          },
        ],
        tenuredAsset: {
          propertyReference: "004567124",
        },
      } as Tenure;
      const asset = {
        assetAddress: {
          addressLine1: "10 Address Street",
          postCode: "E8 1DY",
        },
      } as Asset;

      jest.spyOn(tenureV1, "useTenure").mockReturnValue({
        data: tenure,
      } as AxiosSWRResponse<Tenure>);

      jest.spyOn(assetV1, "useAsset").mockReturnValue({
        data: asset,
      } as AxiosSWRResponse<Asset>);

      const { container } = render(
        <ProcessMenu id={mockActiveTenureV1.id} targetType="tenure" />,
      );
      expect(container).toMatchSnapshot();
    });

    test("Other tenancy changes has the correct query", () => {
      const tenure = {
        paymentReference: "2083027608",
        householdMembers: [
          {
            fullName: "Test1 Test",
            isResponsible: true,
          },
        ],
        tenuredAsset: {
          propertyReference: "004567124",
          fullAddress: "10 Address Street E8 1DY",
        },
      } as Tenure;

      jest.spyOn(tenureV1, "useTenure").mockReturnValue({
        data: tenure,
      } as AxiosSWRResponse<Tenure>);

      const { container } = render(
        <ProcessMenu id={mockActiveTenureV1.id} targetType="tenure" />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
