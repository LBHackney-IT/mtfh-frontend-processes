import { Form, Formik } from "formik";

import { locale } from "../../services";

import { editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Dialog,
  DialogActions,
  Field,
  Link,
  TextArea,
} from "@mtfh/common/lib/components";

export const CloseCaseDialog = ({
  stateConfig,
  process,
  mutate,
  setGlobalError,
  isOpen,
  setIsOpen,
}): JSX.Element => {
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
          try {
            await editProcess({
              id: process.id,
              processTrigger: stateConfig.triggers.closeProcess,
              processName: process?.processName,
              etag: process.etag || "",
              formData: {
                hasNotifiedResident: false,
                reasonForRejection: values.reasonForRejection,
              },
              documents: [],
            });
            mutate();
          } catch (e: any) {
            setIsOpen(false);
            setGlobalError(e.response?.status || 500);
          }
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
