import React from "react";

import { postCommentV2, render, server } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { locale } from "../../../../services";
import { CommentsView } from "./comments-view";

import * as commentsV2 from "@mtfh/common/lib/api/comments/v2/services";
import { CommentsResponse } from "@mtfh/common/lib/api/comments/v2/services";
import * as referenceDataV1 from "@mtfh/common/lib/api/reference-data/v1/service";
import { AxiosSWRInfiniteResponse, AxiosSWRResponse } from "@mtfh/common/lib/http";

const targetType = "process";
const targetId = "process-id-0";
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

describe("CommentsView", () => {
  test("it renders comments by default", async () => {
    const { container } = render(
      <CommentsView targetType={targetType} targetId={targetId} mutate={mutate} />,
    );
    await expect(screen.findByText("test description 1")).resolves.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("it renders inputs to add comments when user clicks Add Comment", async () => {
    server.use(postCommentV2("", 200));
    const { container } = render(
      <CommentsView targetType={targetType} targetId={targetId} mutate={mutate} />,
    );

    await userEvent.click(screen.getByTestId("add-comment"));

    await expect(screen.findByText("Comment title")).resolves.toBeInTheDocument();
    await expect(screen.getByTestId("comment-form-submit")).toBeDisabled();

    expect(container).toMatchSnapshot();

    await userEvent.type(screen.getByTestId("comment-form:title"), "test");
    await userEvent.type(screen.getByTestId("comment-form:description"), "test");

    await expect(screen.getByTestId("comment-form-submit")).not.toBeDisabled();
    await userEvent.click(screen.getByTestId("comment-form-submit"));

    await expect(screen.findByText("Comment title")).resolves.not.toBeInTheDocument();
  });

  test(`it opens a modal when user click "Cancel comment" link`, async () => {
    const { container } = render(
      <CommentsView targetType={targetType} targetId={targetId} mutate={mutate} />,
    );

    await userEvent.click(screen.getByTestId("add-comment"));
    await userEvent.click(screen.getByText("Cancel comment"));

    await expect(
      screen.findByText("Do you want to cancel this comment? All progress will be lost"),
    ).resolves.toBeInTheDocument();

    expect(container).toMatchSnapshot();

    await userEvent.click(screen.getByText("No"));
    await expect(screen.queryByText("No")).toBeNull();
    await expect(screen.getByTestId("comment-form:title")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Cancel comment"));
    await expect(
      screen.findByText("Do you want to cancel this comment? All progress will be lost"),
    ).resolves.toBeInTheDocument();
    await userEvent.click(screen.getByText("Close"));
    await expect(screen.queryByText("No")).toBeNull();
  });

  test(`it opens a modal when user click "Cancel comment" link and closes on dismiss`, async () => {
    render(<CommentsView targetType={targetType} targetId={targetId} mutate={mutate} />);

    await userEvent.click(screen.getByTestId("add-comment"));
    await userEvent.click(screen.getByText("Cancel comment"));

    await expect(
      screen.findByText("Do you want to cancel this comment? All progress will be lost"),
    ).resolves.toBeInTheDocument();

    await userEvent.click(screen.getByText("Close"));
    await expect(
      screen.queryByText("Do you want to cancel this comment? All progress will be lost"),
    ).toBeNull();
  });

  test(`it opens a modal when user click "Cancel comment" link and closes a modal when user click "Yes"`, async () => {
    render(<CommentsView targetType={targetType} targetId={targetId} mutate={mutate} />);

    await userEvent.click(screen.getByTestId("add-comment"));
    await userEvent.click(screen.getByText("Cancel comment"));

    await expect(
      screen.findByText("Do you want to cancel this comment? All progress will be lost"),
    ).resolves.toBeInTheDocument();

    await userEvent.click(screen.getByTestId("close-comment-modal-yes"));
    await expect(screen.queryByTestId("close-comment-modal-yes")).toBeNull();
  });

  test("it shows an errors form response", async () => {
    server.use(
      postCommentV2(
        {
          errors: {
            Description:
              '{\n  "errorCode": "W00",\n  "errorMessage": "Description error"}',
          },
        },
        400,
      ),
    );

    render(<CommentsView targetType={targetType} targetId={targetId} mutate={mutate} />);
    await userEvent.click(screen.getByTestId("add-comment"));
    await userEvent.type(screen.getByTestId("comment-form:title"), "test");
    await userEvent.type(screen.getByTestId("comment-form:description"), "test");
    await userEvent.click(screen.getByTestId("comment-form-submit"));

    await waitFor(() => {
      expect(screen.queryByText("Description error")).toBeInTheDocument();
    });
  });

  test("it shows an error if unable to post", async () => {
    server.use(postCommentV2("error", 500));

    render(<CommentsView targetType={targetType} targetId={targetId} mutate={mutate} />);
    await userEvent.click(screen.getByTestId("add-comment"));
    await userEvent.type(screen.getByTestId("comment-form:title"), "test");
    await userEvent.type(screen.getByTestId("comment-form:description"), "test");
    await userEvent.click(screen.getByTestId("comment-form-submit"));

    await waitFor(() => {
      expect(
        screen.queryByText(locale.errors.somethingWentWrongLabel),
      ).toBeInTheDocument();
    });
  });
});
