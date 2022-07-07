import { Form, Formik } from "formik";

import {
  ChangeOfNameHeader,
  ContactDetails,
  DateTimeFields,
} from "../../../../../components";
import { RequestDocumentsFormData, requestDocumentsSchema } from "../../../../../schemas";
import { locale } from "../../../../../services";
import { Trigger } from "../../../../../services/processes/types";
import { IProcess, ProcessComponentProps } from "../../../../../types";
import { dateToString, stringToDate } from "../../../../../utils/date";
import { BulletWithExplanation } from "../../../sole-to-joint-view/states/shared";

import { editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Heading,
  InlineField,
  List,
  Radio,
  RadioGroup,
  Spinner,
  Text,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

interface RequestDocumentsViewProps extends ProcessComponentProps {
  processConfig: IProcess;
}

export const RequestDocumentsView = ({
  process,
  processConfig,
  mutate,
  optional,
}: RequestDocumentsViewProps): JSX.Element => {
  const { person } = optional;
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <div data-testid="changeofname-RequestDocuments">
      <ChangeOfNameHeader processConfig={processConfig} process={process} />

      <Heading variant="h3">{locale.supportingDocuments}</Heading>

      <Text size="sm">
        The tenant needs to provide documents as proof to support their application:
      </Text>
      <List variant="bullets">
        <BulletWithExplanation
          text="Two forms of proof of identity. At least one must be photographic ID. Both must contain the tenants new name"
          explanation="for example: valid passport, driving licence, bank statement, utility bill"
        />
        <div>
          <Text size="sm" style={{ fontWeight: "bold" }}>
            One of the following documents containing the tenant’s new name:
            <ol type="1" style={{ marginLeft: "2em", marginTop: 15 }}>
              {[
                "Marriage certificate",
                "Civil partnership certificate",
                "Decree absolute",
                "Final order",
                "Deed poll document",
                "Statutory declaration",
              ].map((item) => (
                <li key={item} style={{ marginTop: 0 }}>
                  {item}
                </li>
              ))}
            </ol>
          </Text>
        </div>
      </List>

      <Heading variant="h3">Checking supporting documents</Heading>
      <Text size="sm">
        You can request supporting documents through the Document Evidence Store or you
        can make an appointment with the tenant to check supporting documents in-person.
      </Text>

      {person ? (
        <ContactDetails
          fullName={`${person.firstName} ${person.surname}`}
          personId={person.id}
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
    </div>
  );
};
