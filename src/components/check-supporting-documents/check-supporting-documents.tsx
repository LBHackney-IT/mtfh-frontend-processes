import { Form, Formik } from "formik";

import { ContactDetails, DateTimeFields } from "..";
import { RequestDocumentsFormData, requestDocumentsSchema } from "../../schemas";
import { Trigger } from "../../services/processes/types";
import { ProcessComponentProps } from "../../types";
import { dateToString, stringToDate } from "../../utils/date";

import { editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Heading,
  InlineField,
  Radio,
  RadioGroup,
  Spinner,
  Text,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

export const CheckSupportingDocuments = ({
  process,
  mutate,
  optional,
}: ProcessComponentProps): JSX.Element => {
  const { person, tenant } = optional;
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Heading variant="h3">Checking supporting documents</Heading>
      <Text size="sm">
        You can request supporting documents through the Document Evidence Store or you
        can make an appointment with the tenant to check supporting documents in-person.
      </Text>

      {person || tenant ? (
        <ContactDetails
          fullName={`${
            person ? `${person.firstName} ${person.surname}` : tenant.fullName
          }`}
          personId={person ? person.id : tenant.id}
        />
      ) : (
        <Text>Contact details not found.</Text>
      )}

      <Formik<RequestDocumentsFormData>
        initialValues={{
          requestType: "",
          day: "",
          month: "",
          year: "",
          hour: "",
          minute: "",
          amPm: "",
        }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={requestDocumentsSchema(errorMessages)}
        onSubmit={async (values) => {
          const { requestType, day, month, year, hour, minute, amPm } = values;
          let processTrigger = Trigger.RequestDocumentsDes;
          let formData = {};
          if (requestType === "manual") {
            processTrigger = Trigger.RequestDocumentsAppointment;
            const date = stringToDate(
              `${day}/${month}/${year} ${hour}:${minute} ${amPm.toUpperCase()}`,
              "dd/MM/yyyy hh:mm a",
            );
            formData = {
              appointmentDateTime: dateToString(date, "yyyy-MM-dd'T'HH:mm:ss"),
            };
          }
          try {
            await editProcess({
              id: process.id,
              processName: process?.processName,
              etag: process.etag || "",
              processTrigger,
              formData,
              documents: [],
            });
            mutate();
          } catch (e: any) {
            console.log(e.response?.status || 500);
          }
        }}
      >
        {(props) => {
          const {
            values,
            values: { requestType },
            setFieldValue,
          } = props;
          return (
            <Form
              noValidate
              id="request-documents-form"
              className="request-documents-form"
            >
              <RadioGroup>
                <InlineField name="requestType" type="radio">
                  <Radio
                    id="requestType-automatic"
                    value="automatic"
                    onClick={() => {
                      if (requestType !== "automatic") {
                        setFieldValue("day", "01");
                        setFieldValue("month", "01");
                        setFieldValue("year", "3000");
                        setFieldValue("hour", "01");
                        setFieldValue("minute", "01");
                        setFieldValue("amPm", "am");
                      }
                    }}
                  >
                    Request documents electronically
                  </Radio>
                </InlineField>
                <InlineField name="requestType" type="radio">
                  <Radio
                    id="requestType-manual"
                    value="manual"
                    onClick={() => {
                      if (requestType !== "manual") {
                        setFieldValue("day", "");
                        setFieldValue("month", "");
                        setFieldValue("year", "");
                        setFieldValue("hour", "");
                        setFieldValue("minute", "");
                        setFieldValue("amPm", "");
                      }
                    }}
                  >
                    I have made an appointment to check supporting documents
                  </Radio>
                </InlineField>
              </RadioGroup>
              {requestType === "manual" && <DateTimeFields />}
              <Button
                type="submit"
                disabled={
                  !Object.values(values).some((value) => {
                    return value !== "";
                  })
                }
              >
                Next
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
