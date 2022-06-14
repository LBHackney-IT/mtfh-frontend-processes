import React from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CommentsView } from "./comments-view";

import * as commentsV2 from "@mtfh/common/lib/api/comments/v2/services";
import { CommentsResponse } from "@mtfh/common/lib/api/comments/v2/services";
import * as referenceDataV1 from "@mtfh/common/lib/api/reference-data/v1/service";
import { AxiosSWRInfiniteResponse, AxiosSWRResponse } from "@mtfh/common/lib/http";

const tenureId = "tenure-id-0";
const mutate = () => undefined;

const fullName = "Name Surname";
const email = "email@test.com";

const commentsResponse: CommentsResponse[] = [
  {
    results: [
      {
        id: "fbf6e1be-4045-4d73-a93b-6c50539cfc9c",
        title: null,
        description: "test description 1",
        targetType: "tenure",
        targetId: "c59d1888-b288-0fff-706b-ff3df2cbd51e",
        createdAt: "2022-06-13T13:48:27.562Z",
        categorisation: {
          category: null,
          subCategory: null,
          description: null,
        },
        author: {
          fullName,
          email,
        },
        highlight: false,
      },
      {
        id: "da5a7f4c-ee1e-482d-a955-7977e5ad5daa",
        title: null,
        description: "test description 2",
        targetType: "tenure",
        targetId: "c59d1888-b288-0fff-706b-ff3df2cbd51e",
        createdAt: "2022-06-13T13:29:33.938Z",
        categorisation: {
          category: null,
          subCategory: null,
          description: null,
        },
        author: {
          fullName,
          email,
        },
        highlight: false,
      },
    ],
    paginationDetails: {
      nextToken: "nextToken",
    },
  } as CommentsResponse,
];

const referenceData = {
  category: "category-1",
};

beforeEach(() => {
  jest.spyOn(commentsV2, "useComments").mockReturnValue({
    data: commentsResponse,
    size: 1,
  } as unknown as AxiosSWRInfiniteResponse<CommentsResponse>);

  jest.spyOn(referenceDataV1, "useReferenceData").mockReturnValue({
    data: referenceData,
  } as unknown as AxiosSWRResponse<any>);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("it renders comments by default", async () => {
  const { container } = render(<CommentsView tenureId={tenureId} mutate={mutate} />);
  await expect(screen.findByText("test description 1")).resolves.toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test("it renders inputs to add comments when user clicks Add Comment", async () => {
  const { container } = render(<CommentsView tenureId={tenureId} mutate={mutate} />);

  await userEvent.click(screen.getByTestId("add-comment"));

  await expect(screen.findByText("Comment title")).resolves.toBeInTheDocument();
  await expect(screen.getByTestId("comment-form-submit")).toBeDisabled();

  expect(container).toMatchSnapshot();

  await userEvent.type(screen.getByTestId("comment-form:title"), "test");
  await userEvent.type(screen.getByTestId("comment-form:description"), "test");

  await expect(screen.getByTestId("comment-form-submit")).not.toBeDisabled();
});

test(`it opens a modal when user click "Cancel comment" link`, async () => {
  const { container } = render(<CommentsView tenureId={tenureId} mutate={mutate} />);

  await userEvent.click(screen.getByTestId("add-comment"));
  await userEvent.click(screen.getByText("Cancel comment"));

  await expect(
    screen.findByText("Do you want to cancel this comment? All progress will be lost"),
  ).resolves.toBeInTheDocument();

  expect(container).toMatchSnapshot();
});
