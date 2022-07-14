import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Form, Formik } from "formik";

import { addComment } from "@mtfh/common/lib/api/comments/v2";
import {
  Button,
  CommentList,
  Dialog,
  DialogActions,
  Field,
  Heading,
  Input,
  Link,
  TextArea,
} from "@mtfh/common/lib/components";

import "../../sole-to-joint-view/styles.scss";

export const CommentsView = ({ targetType, targetId, mutate }) => {
  const [addCommentOpen, setAddCommentOpen] = useState<boolean>(false);
  const [closeCommentOpen, setCloseCommentOpen] = useState<boolean>(false);
  const [refreshTargetId, setRefreshTargetId] = useState<string | undefined>();

  return (
    <>
      <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
        Comments
      </Heading>

      {addCommentOpen ? (
        <>
          <Formik
            initialValues={{ description: undefined, title: undefined }}
            onSubmit={async (values) => {
              const { description, title } = values;
              try {
                addComment({
                  description: description!!,
                  title: title || null,
                  targetType,
                  targetId,
                  highlight: false,
                });
                mutate();
              } catch (e: any) {
                console.log(e.response?.status || 500);
              } finally {
                setRefreshTargetId("a-temp-id"); // to force CommentList refresh itself
                setAddCommentOpen(false);
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
              return (
                <Form noValidate id="comment-form" className="comment-form">
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
                      rows={5}
                      maxLength={500}
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
