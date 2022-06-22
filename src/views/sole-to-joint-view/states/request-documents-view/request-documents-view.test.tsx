import React from "react";

import {
  getContactDetailsV2,
  getTenureV1,
  mockActiveTenureV1,
  mockContactDetailsV2,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale, processes } from "../../../../services";
import { mockBreachChecksPassedState, typeDateTime } from "../../../../test-utils";
import { RequestDocumentsView } from "./request-dcouments-view";

import * as contactDetailsService from "@mtfh/common/lib/api/contact-details/v2/service";
import { ContactDetailsResponse } from "@mtfh/common/lib/api/contact-details/v2/service";
import {
  ContactDetail,
  ContactInformationContactTypes,
} from "@mtfh/common/lib/api/contact-details/v2/types";
import * as processV1 from "@mtfh/common/lib/api/process/v1/service";
import { AxiosSWRResponse } from "@mtfh/common/lib/http";

describe("request-documents-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

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
      <RequestDocumentsView
        processConfig={processes.soletojoint}
        process={mockBreachChecksPassedState}
        mutate={() => {}}
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
      <RequestDocumentsView
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

  test("it submits schedule appointment", async () => {
    const editProcessSpy = jest.spyOn(processV1, "editProcess");
    server.use(getContactDetailsV2(mockContactDetailsV2));
    server.use(patchProcessV1({}, 200));
    server.use(getTenureV1(mockActiveTenureV1, 200));

    render(
      <RequestDocumentsView
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
    await userEvent.click(radioButton);
    await typeDateTime(screen, userEvent, "2099");
    await expect(screen.findByText("Next")).resolves.toBeEnabled();
    await userEvent.click(screen.getByText("Next"));
    expect(editProcessSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        processTrigger: "RequestDocumentsAppointment",
      }),
    );
  });

  test("it renders error if tenure cannot be fetched", async () => {
    server.use(getTenureV1({}, 500));
    render(
      <RequestDocumentsView
        processConfig={processes.soletojoint}
        process={mockBreachChecksPassedState}
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
  });
});
