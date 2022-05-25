import { Form, Formik } from "formik";

import { locale } from "../../services";

import {
  Button,
  Dialog,
  DialogActions,
  Field,
  Link,
  TextArea,
} from "@mtfh/common/lib/components";

export const CloseCaseDialog = ({ isOpen, setIsOpen, setReason }): JSX.Element => {
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={() => setIsOpen(false)}
      title={locale.views.closeCase("sole to joint")}
    >
      <Formik
        initialValues={{ reasonForRejection: "" }}
        onSubmit={async (values) => {
          console.log(values.reasonForRejection);
          setReason(values.reasonForRejection);
          setIsOpen(false);
        }}
      >
        <Form>
          <Field
            id="close-case-form-reason"
            name="reasonForRejection"
            label="Reason for Rejection"
            required
          >
            <TextArea rows={5} />
          </Field>
          <DialogActions>
            <Button type="submit">{locale.confirm}</Button>
            <Link as="button" onClick={() => setIsOpen(false)}>
              {locale.cancel}
            </Link>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
