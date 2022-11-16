import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Form, Formik } from "formik";

import { CommentsFormData } from "../../../../schemas/comments";
import { locale } from "../../../../services";

import { addComment } from "@mtfh/common/lib/api/comments/v2";
import {
  Button,
  Center,
  CommentList,
  Dialog,
  DialogActions,
  ErrorSummary,
  Field,
  Heading,
  Input,
  Link,
  Spinner,
  TextArea,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

import "../../sole-to-joint-view/styles.scss";

export const CommentsView = ({ targetType, targetId, mutate }) => {
  const [addCommentOpen, setAddCommentOpen] = useState<boolean>(false);
  const [closeCommentOpen, setCloseCommentOpen] = useState<boolean>(false);
  const [refreshTargetId, setRefreshTargetId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const { W1: correctIndicatedErrorsText } = errorMessages;
  return (
    <>
      <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
        Comments
      </Heading>

      {addCommentOpen ? (
        <>
          <Formik<CommentsFormData>
            initialValues={{ description: "", title: "" }}
            onSubmit={async (values, { setErrors }) => {
              const { description, title } = values;
              setError(undefined);
              try {
                await addComment({
                  description,
                  title,
                  targetType,
                  targetId,
                  highlight: false,
                });
                setAddCommentOpen(false);
                mutate();
              } catch (error: any) {
                if (typeof error === "object" && error.isAxiosError === true) {
                  const errors: Record<string, string> = {};
                  if (error.response.data.errors) {
                    Object.entries(error.response.data.errors).forEach(([key, value]) => {
                      errors[key.charAt(0).toLowerCase() + key.slice(1)] = JSON.parse(
                        value as string,
                      ).errorMessage;
                    });
                  }
                  switch (error.response.status) {
                    case 400:
                    case 404:
                      setErrors(errors);
                      return setError("invalid");
                    default:
                      return setError("error");
                  }
                }
              } finally {
                setRefreshTargetId("a-temp-id"); // to force CommentList refresh itself
                setRefreshTargetId(undefined);
              }
            }}
          >
            {(props) => {
              const {
                handleChange,
                handleBlur,
                values: { description, title },
              } = props;
              const hasFieldErrors = Object.keys(props.errors).length > 0;
              return (
                <Form noValidate id="comment-form" className="comment-form">
                  {(hasFieldErrors || error) && (
                    <ErrorSummary
                      id="add-comments-error"
                      title={locale.errors.errorLabel}
                    >
                      <>
                        {hasFieldErrors && <p>{correctIndicatedErrorsText}</p>}
                        {error && <p>{locale.errors.somethingWentWrongLabel}</p>}
                      </>
                    </ErrorSummary>
                  )}

                  <Field id="comment-title" name="title" label="Comment title" required>
                    <Input data-testid="comment-form:title" />
                  </Field>
                  <Field
                    id="comment-description"
                    name="description"
                    label="Comment"
                    required
                  >
                    <TextArea
                      rows={10}
                      maxLength={1000}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={description}
                      data-testid="comment-form:description"
                    />
                  </Field>
                  <Button
                    type="submit"
                    data-testid="comment-form-submit"
                    disabled={!description || !title}
                  >
                    Save comment
                  </Button>
                </Form>
              );
            }}
          </Formik>

          <Dialog
            isOpen={closeCommentOpen}
            onDismiss={() => setCloseCommentOpen(false)}
            title="Do you want to cancel this comment? All progress will be lost"
          >
            <DialogActions className="closeCommentDialogActions">
              <Button
                data-testid="close-comment-modal-yes"
                onClick={() => {
                  setCloseCommentOpen(false);
                  setAddCommentOpen(false);
                }}
              >
                Yes
              </Button>
              <Button variant="secondary" onClick={() => setCloseCommentOpen(false)}>
                No
              </Button>
            </DialogActions>
          </Dialog>

          <Link
            as={RouterLink}
            to="#"
            variant="link"
            onClick={() => setCloseCommentOpen(true)}
          >
            Cancel comment
          </Link>
        </>
      ) : (
        <>
          <Button
            style={{ marginTop: "1em" }}
            data-testid="add-comment"
            variant="secondary"
            onClick={() => {
              setAddCommentOpen(true);
            }}
          >
            Add comment
          </Button>
          <div>
            <CommentList targetId={refreshTargetId || targetId} />
          </div>
        </>
      )}
    </>
  );
};
