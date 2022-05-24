import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { format, parse } from "date-fns";
import { Form, Formik } from "formik";

import { locale } from "../../../../services";
import { IProcess } from "../../../../types";
import { EligibilityChecksPassedBox } from "./shared";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Checkbox,
  DateField,
  Heading,
  Link,
  LinkButton,
  StatusErrorSummary,
  StatusHeading,
  Text,
  TimeField,
} from "@mtfh/common/lib/components";
import { dateToString, isFutureDate } from "@mtfh/common/lib/utils";

const { views } = locale;
const { reviewDocuments } = views;
interface ReviewDocumentsViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
}
function getAppointmentDateTime({
  day,
  month,
  year,
  hour,
  minute,
  amPm,
}: {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  amPm: string;
}) {
  return parse(
    `${year}-${month}-${day} ${hour}:${minute} ${amPm.toUpperCase()}`,
    "yyyy-MM-dd hh:mm a",
    new Date(),
  );
}

export const ReviewDocumentsView = ({
  processConfig,
  process,
  mutate,
}: ReviewDocumentsViewProps) => {
  const [seenPhotographicId, setSeenPhotographicId] = useState<boolean>(false);
  const [seenSecondId, setSeenSecondId] = useState<boolean>(false);
  const [isNotInImmigrationControl, setIsNotInImmigrationControl] =
    useState<boolean>(false);
  const [seenProofOfRelationship, setSeenProofOfRelationship] = useState<boolean>(false);
  const [incomingTenantLivingInProperty, setIncomingTenantLivingInProperty] =
    useState<boolean>(false);

  const { states } = processConfig;
  const stateConfigs = {
    [states.documentsRequestedDes.state]: processConfig.states.documentsRequestedDes,
    [states.documentsRequestedAppointment.state]:
      processConfig.states.documentsRequestedAppointment,
    [states.documentsAppointmentRescheduled.state]:
      processConfig.states.documentsAppointmentRescheduled,
  };
  const stateConfig = stateConfigs[process.currentState.state];
  const [globalError, setGlobalError] = useState<number>();

  return (
    <div data-testid="soletojoint-ReviewDocuments">
      {globalError && (
        <StatusErrorSummary id="review-documents-global-error" code={globalError} />
      )}
      <EligibilityChecksPassedBox />

      <Box variant="success">
        <StatusHeading variant="success" title={reviewDocuments.documentsRequested} />
        <div
          style={{ marginLeft: 60, marginTop: 17.5 }}
          className="govuk-link lbh-link lbh-link--no-visited-state"
        >
          <Link as={RouterLink} to="#" variant="link">
            View request in Document Evidence Store
          </Link>
        </div>
      </Box>

      <ReviewDocumentsAppointmentForm
        stateConfig={stateConfig}
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        setGlobalError={setGlobalError}
      />

      <div style={{ paddingBottom: 35 }} />

      <Formik
        initialValues={{}}
        onSubmit={async () => {
          try {
            await editProcess({
              id: process.id,
              processTrigger: stateConfig.triggers.reviewDocuments,
              processName: process?.processName,
              etag: process.etag || "",
              formData: {
                seenPhotographicId,
                seenSecondId,
                isNotInImmigrationControl,
                seenProofOfRelationship,
                incomingTenantLivingInProperty,
              },
              documents: [],
            });
            mutate();
          } catch (e: any) {
            setGlobalError(e.response?.status || 500);
          }
        }}
      >
        {() => {
          return (
            <Form noValidate id="review-documents-form" className="review-documents-form">
              <Heading variant="h4">
                Use the form below to record the documents you have checked:
              </Heading>
              <Checkbox
                id="seen-photographic-id"
                checked={seenPhotographicId}
                onChange={() => setSeenPhotographicId(!seenPhotographicId)}
                hint="(for example: valid passport, driving licence)"
              >
                {reviewDocuments.seenPhotographicId}
              </Checkbox>
              <Checkbox
                id="seen-second-id"
                checked={seenSecondId}
                onChange={() => setSeenSecondId(!seenSecondId)}
                hint="(for example: utility bill, bank statement, council letter)"
              >
                {reviewDocuments.seenSecondId}
              </Checkbox>
              <Checkbox
                id="is-not-immigration-control"
                checked={isNotInImmigrationControl}
                onChange={() => setIsNotInImmigrationControl(!isNotInImmigrationControl)}
                hint="(for example: passport, home office letter, embassy letter, immigration status document)"
              >
                {reviewDocuments.isNotInImmigrationControl}
              </Checkbox>
              <Checkbox
                id="seen-proof-of-relationship"
                checked={seenProofOfRelationship}
                onChange={() => setSeenProofOfRelationship(!seenProofOfRelationship)}
                hint="(for example: marriage or civil partner certificate)"
              >
                {reviewDocuments.seenProofOfRelationship}
              </Checkbox>
              <Checkbox
                id="incoming-tenant-living-in-property"
                checked={incomingTenantLivingInProperty}
                onChange={() =>
                  setIncomingTenantLivingInProperty(!incomingTenantLivingInProperty)
                }
                hint="(for example: letter, utility bill, council tax bill)"
              >
                {reviewDocuments.incomingTenantLivingInProperty}
              </Checkbox>
              <Button
                type="submit"
                disabled={
                  !seenPhotographicId ||
                  !seenSecondId ||
                  !isNotInImmigrationControl ||
                  !seenProofOfRelationship ||
                  !incomingTenantLivingInProperty
                }
                style={{ width: 222 }}
              >
                Next
              </Button>
            </Form>
          );
        }}
      </Formik>
      <Text size="md">
        If the documents are not suitable and all avenues to obtain the right documents
        have been exhausted, then close the case.
      </Text>
      <Button variant="secondary" style={{ width: 222 }}>
        Close case
      </Button>
    </div>
  );
};

interface ReviewDocumentsAppointmentFormProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  stateConfig: {
    [key: string]: any;
  };
  setGlobalError: any;
}

export const ReviewDocumentsAppointmentForm = ({
  processConfig,
  process,
  mutate,
  stateConfig,
  setGlobalError,
}: ReviewDocumentsAppointmentFormProps): JSX.Element => {
  const [needAppointment, setNeedAppointment] = useState<boolean>(false);

  const { states } = processConfig;
  const formData = process.currentState.processData.formData as {
    appointmentDateTime: string;
  };

  return [
    states.documentsRequestedAppointment.state,
    states.documentsAppointmentRescheduled.state,
  ].includes(process.currentState.state) && !needAppointment ? (
    <Box>
      <StatusHeading variant="base" title={reviewDocuments.appointmentScheduled} />
      <Text style={{ marginLeft: 60 }}>
        Date: {format(new Date(formData.appointmentDateTime), "eeee do MMMM yyyy")}
        <br />
        Time: {format(new Date(formData.appointmentDateTime), "hh:mm aaa")}
      </Text>
      <LinkButton style={{ marginLeft: 60 }} onClick={() => setNeedAppointment(true)}>
        {locale.change}
      </LinkButton>
    </Box>
  ) : (
    <BookAppointmentForm
      processConfig={processConfig}
      stateConfig={stateConfig}
      process={process}
      mutate={mutate}
      setGlobalError={setGlobalError}
      needAppointment={needAppointment}
      setNeedAppointment={setNeedAppointment}
    />
  );
};

export const BookAppointmentForm = ({
  processConfig,
  stateConfig,
  process,
  mutate,
  setGlobalError,
  needAppointment,
  setNeedAppointment,
}): JSX.Element => {
  const [bookAppointmentDisabled, setBookAppointmentDisabled] = useState<boolean>(true);

  const { states } = processConfig;

  return (
    <Formik
      initialValues={{ day: "", month: "", year: "", hour: "", minute: "", amPm: "" }}
      onSubmit={async (values) => {
        const appointmentDateTime = getAppointmentDateTime(values);
        const processTrigger = [
          states.documentsRequestedAppointment.state,
          states.documentsAppointmentRescheduled.state,
        ].includes(process.currentState.state)
          ? stateConfig.triggers.rescheduleDocumentsAppointment
          : stateConfig.triggers.requestDocumentsAppointment;
        try {
          await editProcess({
            id: process.id,
            processTrigger,
            processName: process?.processName,
            etag: process.etag || "",
            formData: {
              appointmentDateTime,
            },
            documents: [],
          });
          setNeedAppointment(!needAppointment);
          mutate();
        } catch (e: any) {
          setGlobalError(e.response?.status || 500);
        }
      }}
      validateOnBlur
      validate={(values) => {
        if (
          !values.day ||
          !values.month ||
          !values.year ||
          !values.hour ||
          !values.minute ||
          !values.amPm ||
          !["am", "pm"].includes(values.amPm)
        ) {
          setBookAppointmentDisabled(true);
          return;
        }
        if (
          !isFutureDate(
            dateToString(getAppointmentDateTime(values), "yyyy-MM-dd'T'HH:mm:ss"),
          )
        ) {
          setBookAppointmentDisabled(true);
          return;
        }
        setBookAppointmentDisabled(false);
      }}
    >
      {() => {
        return (
          <Form
            noValidate
            id="request-appointment-form"
            className="request-appointment-form"
          >
            <Checkbox
              id="condition"
              checked={needAppointment}
              onChange={() => setNeedAppointment(!needAppointment)}
            >
              I need to make an appointment to check supporting documents
            </Checkbox>
            {needAppointment && (
              <>
                <div style={{ display: "flex" }}>
                  <DateField
                    id="appointment-form-date"
                    className="mtfh-appointment-form__date"
                    label="Date"
                    dayLabel=""
                    monthLabel=""
                    yearLabel=""
                    dayProps={{ name: "day", placeholder: "dd" }}
                    monthProps={{ name: "month", placeholder: "mm" }}
                    yearProps={{ name: "year", placeholder: "yy" }}
                    style={{ marginTop: "1.5em", width: "100%" }}
                    required
                  />
                  <TimeField
                    id="appointment-form-time"
                    className="mtfh-appointment-form__time"
                    label="Time"
                    hourLabel=""
                    minuteLabel=""
                    amPmLabel=""
                    hourProps={{ name: "hour", placeholder: "00" }}
                    minuteProps={{ name: "minute", placeholder: "00" }}
                    amPmProps={{ name: "amPm", placeholder: "am" }}
                    style={{ marginTop: "1.5em", width: "100%" }}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={bookAppointmentDisabled}
                  style={{ width: 222 }}
                >
                  {locale.bookAppointment}
                </Button>
              </>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
