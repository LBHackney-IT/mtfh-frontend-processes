import React from "react";

import {
  getContactDetailsV2,
  getReferenceDataV1,
  mockContactDetailsV2,
  mockPersonV1,
  mockProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";

import { RequestDocumentsView } from "./request-documents-view";

const options = {
  url: "/processes/changeofname/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/:processName/:processId",
};

describe("changeofname/request-documents-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("it renders RequestDocuments correctly on state NameSubmitted", async () => {
    server.use(getReferenceDataV1({}));
    server.use(getContactDetailsV2(mockContactDetailsV2));
    const { container } = render(
      <RequestDocumentsView
        process={{
          ...mockProcessV1,
          currentState: { ...mockProcessV1.currentState, state: "NameSubmitted" },
        }}
        mutate={() => {}}
        optional={{
          person: mockPersonV1,
        }}
      />,
      options,
    );
    await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
    expect(container).toMatchSnapshot();
  });
});
