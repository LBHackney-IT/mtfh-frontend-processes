import { Form, Formik } from "formik";

import {
  ReviewDocumentsFormData,
  reviewDocumentsSchema,
} from "../../../../../schemas/change-of-name/review-documents";
import { locale } from "../../../../../services";
import { Trigger } from "../../../../../services/processes/types";
import { IProcess } from "../../../../../types";
import { ReviewDocumentsAppointmentForm } from "../../../shared/review-documents-appointment-form";
import { changeOfNameDocuments } from "../../view-utils";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  FormGroup,
  Heading,
  InlineField,
  Spinner,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

const { views } = locale;
const { reviewDocuments } = views;
interface ReviewDocumentsViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  optional?: any;
  setGlobalError: any;
}

export const ReviewDocumentsView = ({
  processConfig,
  process,
  mutate,
  optional,
  setGlobalError,
}: ReviewDocumentsViewProps) => {
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <div data-testid="changeofname-ReviewDocuments">
      <ReviewDocumentsAppointmentForm
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        setGlobalError={setGlobalError}
      />

      {!optional?.closeProcessReason && (
        <>
          <div style={{ paddingBottom: 35 }} />

          <Formik<ReviewDocumentsFormData>
            initialValues={{
              seenPhotographicId: false,
              seenSecondId: false,
              atLeastOneDocument: false,
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={reviewDocumentsSchema(errorMessages)}
            onSubmit={async (values) => {
              try {
                await editProcess({
                  id: process.id,
                  processTrigger: Trigger.ReviewDocuments,
                  processName: process?.processName,
                  etag: process.etag || "",
                  formData: values,
                  documents: [],
                });
                mutate();
              } catch (e: any) {
                setGlobalError(e.response?.status || 500);
              }
            }}
          >
            {({ values, errors }) => {
              return (
                <Form
                  noValidate
                  id="review-documents-form"
                  className="review-documents-form"
                >
                  <Heading variant="h4">{reviewDocuments.useFormBelow}</Heading>
                  <FormGroup
                    id="review-documents-form-group"
                    label=""
                    error={
                      errors.seenPhotographicId ||
                      errors.seenSecondId ||
                      errors.atLeastOneDocument
                    }
                  >
                    <CheckboxGroup>
                      <InlineField name="seenPhotographicId" type="checkbox">
                        <Checkbox
                          id="seen-photographic-id"
                          hint={reviewDocuments.seenPhotographicIdHint}
                        >
                          {reviewDocuments.seenPhotographicId}
                        </Checkbox>
                      </InlineField>
                      <InlineField name="seenSecondId" type="checkbox">
                        <Checkbox
                          id="seen-second-id"
                          hint={reviewDocuments.seenSecondIdHint}
                        >
                          {reviewDocuments.seenSecondId}
                        </Checkbox>
                      </InlineField>
                      <InlineField name="atLeastOneDocument" type="checkbox">
                        <Checkbox id="confirmation-for-valid-documents">
                          {reviewDocuments.atLeastOneDocument}
                          {changeOfNameDocuments.map((documentName, index) => {
                            return (
                              <>
                                <br />
                                {index + 1}.{documentName}
                              </>
                            );
                          })}
                        </Checkbox>
                      </InlineField>
                    </CheckboxGroup>
                  </FormGroup>
                  <Button
                    type="submit"
                    disabled={
                      !Object.values(values).some((value) => {
                        return value;
                      })
                    }
                    style={{ width: 222 }}
                  >
                    {locale.next}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </>
      )}
    </div>
  );
};
