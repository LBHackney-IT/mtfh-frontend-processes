import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { processes } from "../../../../services";
import { mockBreachChecksPassedState } from "../../../../test-utils";
import { RequestDcoumentsView } from "./request-dcouments-view";

import * as contactDetailsService from "@mtfh/common/lib/api/contact-details/v2/service";
import { ContactDetailsResponse } from "@mtfh/common/lib/api/contact-details/v2/service";
import {
  ContactDetail,
  ContactInformationContactTypes,
} from "@mtfh/common/lib/api/contact-details/v2/types";
import { HouseholdMember } from "@mtfh/common/lib/api/tenure/v1/types";
import { AxiosSWRResponse } from "@mtfh/common/lib/http";

describe("request-documents-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const tenant = { id: "tenant-id" } as HouseholdMember;
  const contactDetailsResponse = {
    results: [
      {
        contactInformation: {
          contactType: ContactInformationContactTypes.EMAIL,
          value: "testtest34335@gmail.com",
        },
      } as ContactDetail,
      {
        contactInformation: {
          contactType: ContactInformationContactTypes.PHONE,
          value: "+44(0)7700 900251",
        },
      } as ContactDetail,
    ],
  } as ContactDetailsResponse;

  test("it renders RequestDocuments correctly on state BreachChecksPassed", async () => {
    jest.spyOn(contactDetailsService, "useContactDetails").mockReturnValue({
      data: contactDetailsResponse,
    } as AxiosSWRResponse<ContactDetailsResponse>);

    const { container } = render(
      <RequestDcoumentsView
        processConfig={processes.soletojoint}
        process={mockBreachChecksPassedState}
        mutate={() => {}}
        tenant={tenant}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );
    expect(container).toMatchSnapshot();
  });

  test("it enables date/time option and next button", async () => {
    const user = userEvent.setup();

    jest.spyOn(contactDetailsService, "useContactDetails").mockReturnValue({
      data: contactDetailsResponse,
    } as AxiosSWRResponse<ContactDetailsResponse>);

    const { container } = render(
      <RequestDcoumentsView
        processConfig={processes.soletojoint}
        process={mockBreachChecksPassedState}
        mutate={() => {}}
      />,
      {
        url: "/processes/soletojoint/e63e68c7-84b0-3a48-b450-896e2c3d7735",
        path: "/processes/soletojoint/:processId",
      },
    );

    const radioButton = await screen.findByText(
      "I have made an appointment to check supporting documents",
    );
    await user.click(radioButton);
    await user.type(screen.getByPlaceholderText(/dd/i), "01");
    await user.type(screen.getByPlaceholderText(/mm/i), "01");
    await user.type(screen.getByPlaceholderText(/yy/i), "2022");
    await user.type(screen.getAllByPlaceholderText(/00/i)[0], "01");
    await user.type(screen.getAllByPlaceholderText(/00/i)[1], "01");
    await user.type(screen.getByPlaceholderText(/am/i), "am");

    expect(container).toMatchSnapshot();
  });
});
