import React from "react";

import { Form, Formik } from "formik";

import { ContactDetails, DateTimeFields, validate } from "..";
import { RequestDocumentsFormData, requestDocumentsSchema } from "../../schemas";
import { Trigger } from "../../services/processes/types";
import { ProcessComponentProps } from "../../types";
import { dateToString, stringToDate } from "../../utils/date";

import { editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Checkbox,
  FormGroup,
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
      <Text>
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
          declaration: false,
        }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={requestDocumentsSchema(errorMessages)}
        validate={(values) => {
          return validate(errorMessages, values);
        }}
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
            errors,
            values,
            values: { requestType },
            setFieldValue,
            dirty,
          } = props;
          return (
            <Form
              noValidate
              id="request-documents-form"
              className="request-documents-form"
            >
              <FormGroup id="request-type-form-group" error={errors.requestType}>
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
              </FormGroup>

              {requestType === "manual" && (
                <DateTimeFields errors={errors} values={values} />
              )}

              <Heading variant="h3">Tenant declaration</Heading>
              <Text>
                Please read this out to the applicant before you proceed to the next step.
                Applicant has to accept the declaration before the application can be
                proceeded:
              </Text>
              <Text>
                “You are declaring that to the best of your knowledge and belief the
                information given is correct in every detail. You understand it is an
                offence to give false or misleading information or to hold back relevant
                information. You also understand that we will check this information and
                if any information is found to be false, you may be prosecuted and we may
                repossess your home.
              </Text>
              <Text>
                If you are prosecuted and found guilty, you understand that you could be
                ordered to pay a fine of up to £5000. It is your duty to make sure that
                your application form is honest. You hereby give your consent for Housing
                Services to carry out a credit reference check and obtain relevant
                information from the Council and other external agencies.”
              </Text>

              <FormGroup id="declaration-form-group" error={errors.declaration}>
                <InlineField name="declaration" type="checkbox">
                  <Checkbox id="declaration" data-testid="declaration">
                    I confirm that the applicant has accepted this declaration
                  </Checkbox>
                </InlineField>
              </FormGroup>
              <Button type="submit" disabled={!dirty}>
                Next
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
