import { Form, Formik } from "formik";

import { SoleToJointHeader } from "../../../../components";
import { DateTimeFields } from "../../../../components/appointment-form/appointment-form";
import {
  RequestDocumentsFormData,
  requestDocumentsSchema,
} from "../../../../schemas/request-documents";
import { locale } from "../../../../services";
import { IProcess } from "../../../../types";
import { dateToString, stringToDate } from "../../../../utils/date";
import {
  BulletWithExplanation,
  EligibilityChecksPassedBox,
  TenantContactDetails,
} from "../shared";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Button,
  Center,
  ErrorSummary,
  Heading,
  InlineField,
  List,
  Radio,
  RadioGroup,
  Spinner,
  Text,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

export interface RequestDocumentsViewProps {
  process: Process;
  processConfig: IProcess;
  mutate: any;
}

export const RequestDocumentsView = ({
  process,
  processConfig,
  mutate,
}: RequestDocumentsViewProps) => {
  const errorMessages = useErrorCodes();
  const { data: tenure, error } = useTenure(process.targetId);

  if (error) {
    return (
      <ErrorSummary
        id="request-documents-view"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!tenure || !errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const stateConfig = processConfig.states.breachChecksPassed;
  const tenant = tenure?.householdMembers.find((m) => m.isResponsible);

  return (
    <div data-testid="soletojoint-RequestDocuments">
      <SoleToJointHeader processConfig={processConfig} process={process} />
      <EligibilityChecksPassedBox />
      <Heading variant="h3">{locale.supportingDocuments}</Heading>
      <Text size="sm">
        The following documentation is required from the secure tenant and/or proposed
        tenant, as proof to support their application:
      </Text>
      <List variant="bullets">
        <BulletWithExplanation
          text="Secure and Proposed tenant: Two forms of proof of identity for both the
              secure and proposed tenant. At least one each must be photographic ID"
          explanation="for example: valid passport, driving licence, bank statement, utility bill"
        />
        <BulletWithExplanation
          text="Proposed tenant: Proof of immigration status"
          explanation="for example: passport, home office letter, embassy letter, immigration status document"
        />
        <BulletWithExplanation
          text="Proposed tenant: Proof of relationship to the existing tenant"
          explanation="for example: marriage or civil partner certificate"
        />
        <BulletWithExplanation
          text="Proposed tenant: Proof of co-habitation: three documents proving 12 months
                residency at the property. If marriage certificate provided, any Proof of
                Address can be accepted."
          explanation="for example: letter, utility bill, council tax bill"
        />
      </List>
      <Heading variant="h3">Checking supporting documents</Heading>
      <Text size="sm">
        You can request supporting documents through the Document Evidence Store or you
        can make an appointment with the tenant to check supporting documents in-person.
      </Text>
      {tenant ? <TenantContactDetails tenant={tenant} /> : <Text>Tenant not found.</Text>}
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
          let processTrigger = stateConfig.triggers.requestDocumentsDes;
          let formData = {};
          if (requestType === "manual") {
            processTrigger = stateConfig.triggers.requestDocumentsAppointment;
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
                      if (requestType === "manual") {
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
                      if (requestType === "automatic") {
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
