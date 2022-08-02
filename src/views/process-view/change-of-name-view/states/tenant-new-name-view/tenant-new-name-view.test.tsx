import React from "react";

import {
  getContactDetailsV2,
  getReferenceDataV1,
  mockContactDetailsV2,
  mockProcessV1,
  patchProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { changeofname } from "../../../../../services/processes";
import { Trigger } from "../../../../../services/processes/types";
import { TenantNewNameView } from "./tenant-new-name-view";

import * as processApi from "@mtfh/common/lib/api/process/v1/service";
import commonLocale from "@mtfh/common/lib/locale";

const options = {
  url: "/processes/changeofname/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/:processName/:processId",
};

describe("changeofname/tenant-new-name-view", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("it renders TenantNewNameView correctly on state EnterNewName", async () => {
    server.use(getReferenceDataV1({}));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <TenantNewNameView
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: changeofname.states.enterNewName.state,
          },
        }}
        mutate={() => {}}
        setGlobalError={() => {}}
      />,
      options,
    );
    await expect(
      screen.findByTestId("changeofname-EnterNewName"),
    ).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it shows validation messages on the relevant fields if they are empty", async () => {
    server.use(getReferenceDataV1({}));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const user = userEvent.setup();
    render(
      <TenantNewNameView
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: changeofname.states.enterNewName.state,
          },
        }}
        mutate={() => {}}
        setGlobalError={() => {}}
      />,
      options,
    );

    const nextButton = await screen.findByText("Next");
    expect(nextButton).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Enter first name"), "t");
    await user.type(screen.getByPlaceholderText("Enter middle name"), "t$");
    expect(nextButton).not.toBeDisabled();

    await user.click(nextButton);
    await expect(
      screen.findByText(commonLocale.hooks.defaultErrorMessages.W5),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.queryByText(commonLocale.hooks.defaultErrorMessages.W56),
    ).not.toBeInTheDocument();
    await expect(
      screen.queryByText(commonLocale.hooks.defaultErrorMessages.W8),
    ).toBeInTheDocument();
    await expect(
      screen.findByText(commonLocale.hooks.defaultErrorMessages.W57),
    ).resolves.toBeInTheDocument();
  });

  test("it submits the form", async () => {
    server.use(getReferenceDataV1({}));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const editProcessSpy = jest.spyOn(processApi, "editProcess");
    const user = userEvent.setup();
    render(
      <TenantNewNameView
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: changeofname.states.enterNewName.state,
          },
        }}
        mutate={() => {}}
        setGlobalError={() => {}}
      />,
      options,
    );

    const nextButton = await screen.findByText("Next");

    await user.selectOptions(screen.getByTestId("mtfh-person-form-title"), "Mr");
    await user.type(screen.getByPlaceholderText("Enter first name"), "name");
    await user.type(screen.getByPlaceholderText("Enter last name"), "lastname");

    await user.click(nextButton);

    expect(editProcessSpy).toBeCalledWith({
      id: mockProcessV1.id,
      processTrigger: Trigger.EnterNewName,
      processName: mockProcessV1?.processName,
      etag: "",
      formData: {
        title: "Mr",
        firstName: "name",
        middleName: "",
        surname: "lastname",
      },
      documents: [],
    });
  });

  test("it renders error when submit fails", async () => {
    server.use(patchProcessV1({}, 500));
    server.use(getReferenceDataV1({}));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    render(
      <TenantNewNameView
        process={{
          ...mockProcessV1,
          currentState: {
            ...mockProcessV1.currentState,
            state: changeofname.states.enterNewName.state,
          },
        }}
        mutate={() => {}}
        setGlobalError={() => {}}
      />,
      options,
    );
    const nextButton = await screen.findByText("Next");
    await userEvent.selectOptions(screen.getByTestId("mtfh-person-form-title"), "Mr");
    await userEvent.type(screen.getByPlaceholderText("Enter first name"), "name");
    await userEvent.type(screen.getByPlaceholderText("Enter last name"), "lastname");
    await userEvent.click(nextButton);

    expect(
      screen.findByText(commonLocale.components.statusErrorSummary.statusTitle(500)),
    ).resolves.toBeInTheDocument();
  });
});
