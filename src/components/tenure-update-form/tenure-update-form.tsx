import React, { useState } from "react";

import { Form, Formik } from "formik";

import {
  TenureStartDateFormData,
  tenureStartDateIsValid,
  tenureStartDateSchema,
} from "../../schemas/tenure-start-date";
import { locale } from "../../services";
import { Trigger } from "../../services/processes/types";
import { getFormattedDateStr } from "../../utils/processUtil";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Checkbox,
  DateField,
  FormGroup,
  Heading,
  InlineField,
  List,
  Spinner,
  Text,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

import "./styles.scss";

interface TenureUpdateFormProps {
  process: Process;
  mutate: () => void;
  setGlobalError: any;
}

export const TenureUpdateForm = ({
  process,
  mutate,
  setGlobalError,
}: TenureUpdateFormProps): JSX.Element => {
  const [checked, setChecked] = useState<boolean>(false);
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
      <Heading variant="h3">{`${locale.views.submitCase.nextSteps}:`}</Heading>
      <Text>{`${locale.views.tenureUpdateForm.checks.introduction},`}</Text>
      <List variant="bullets" style={{ marginLeft: "1em" }}>
        {locale.views.tenureUpdateForm.checks.items.map((item, index) => (
          <Text key={`tenure-update-form-check-${index}`}>{`${item}.`}</Text>
        ))}
      </List>
      <Formik<TenureStartDateFormData>
        initialValues={{ day: "", month: "", year: "" }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={tenureStartDateSchema(errorMessages)}
        validate={(values) => {
          return validate(errorMessages, values);
        }}
        onSubmit={async (values) => {
          const tenureStartDate = getFormattedDateStr(values);
          try {
            await editProcess({
              id: process.id,
              processTrigger: Trigger.UpdateTenure,
              processName: process?.processName,
              etag: process.etag || "",
              formData: {
                tenureStartDate,
              },
              documents: [],
            });
            mutate();
          } catch (e: any) {
            setGlobalError(e.response?.status || 500);
          }
        }}
      >
        {({ errors }) => {
          return (
            <Form
              noValidate
              id="request-tenure-update-form"
              className="request-tenure-update-form"
            >
              <DateFields
                dateLabel={locale.views.tenureUpdateForm.setNewTenureStartDate}
                errors={errors}
              />
              <InlineField name="hasNotifiedResident" type="checkbox">
                <Checkbox
                  id="condition"
                  checked={checked}
                  onClick={() => setChecked(!checked)}
                >
                  {locale.views.tenureUpdateForm.taskConformation}
                </Checkbox>
              </InlineField>
              <Button type="submit" disabled={!checked} style={{ width: 245 }}>
                {locale.confirm}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export const validate = (errorMessages, values) => {
  if (values.year || values.month || values.day) {
    const result = tenureStartDateIsValid(errorMessages, values);
    if (result === true) {
      return {};
    }
    return { global: result };
  }
};

export const DateFields = ({
  dateLabel = "Date",
  errors,
}: {
  dateLabel?: string;
  errors?: any;
}): JSX.Element => {
  return (
    <FormGroup id="tenure-update-form-date-form-group" error={errors?.global}>
      <FormGroup
        id="tenure-update-form-date-field-form-group"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          marginTop: 0,
        }}
      >
        <>
          <DateField
            id="tenure-update-form-date"
            className="mtfh-tenure-update-form__date"
            label={dateLabel}
            dayLabel=""
            monthLabel=""
            yearLabel=""
            dayProps={{ name: "day", placeholder: "dd" }}
            monthProps={{ name: "month", placeholder: "mm" }}
            yearProps={{ name: "year", placeholder: "yyyy" }}
            style={{ flex: "1 1 280px" }}
            required
          />
        </>
      </FormGroup>
    </FormGroup>
  );
};
