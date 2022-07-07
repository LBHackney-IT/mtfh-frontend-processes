import { useState } from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { locale } from "../../../../../services";
import { IProcess } from "../../../../../types";

import { PersonTitle } from "@mtfh/common/lib/api/person/v1";
import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  ErrorSummary,
  Field,
  FormGroup,
  Heading,
  Input,
  Select,
  StatusErrorSummary,
} from "@mtfh/common/lib/components";
import "./styles.scss";

interface TenantNewNameViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  optional?: any;
}

const schema = Yup.object({
  tenant: Yup.string().required(),
});

type FormData = Yup.Asserts<typeof schema>;

export const TenantNewName = ({
  processConfig,
  process,
  mutate,
}: TenantNewNameViewProps) => {
  const stateConfig = processConfig.states.enterNewName;
  const error = undefined;
  const [globalError, setGlobalError] = useState<number>();

  if (error) {
    return (
      <ErrorSummary
        id="tenant-new-name-view"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  return (
    <div data-testid="changeofname-EnterNewName">
      {globalError && (
        <StatusErrorSummary id="select-tenant-global-error" code={globalError} />
      )}
      <Heading variant="h3">Enter tenant's new name</Heading>
      <Formik<FormData>
        initialValues={{ tenant: "" }}
        validateOnChange
        validateOnBlur={false}
        validationSchema={schema}
        onSubmit={async (data) => {
          try {
            await editProcess({
              id: process.id,
              processTrigger: stateConfig.triggers.checkAutomatedEligibility,
              processName: process?.processName,
              etag: process.etag || "",
              formData: {
                incomingTenantId: data.tenant,
              },
              documents: [],
            });
            mutate();
          } catch (e: any) {
            setGlobalError(e.response?.status || 500);
          }
        }}
      >
        {(properties) => {
          return (
            <Form id="person-form" className="mtfh-person-form">
              <FormGroup id="person-form-new-tenant-name" name="new-tenant-name">
                <>
                  <Field
                    id="person-form-title"
                    label={locale.views.person.title}
                    name="title"
                    required
                  >
                    <Select className="mtfh-person-form__input--contained">
                      <option value="">{locale.views.person.titlePlaceholder}</option>
                      {(Object.keys(PersonTitle) as Array<keyof typeof PersonTitle>).map(
                        (key) => (
                          <option key={key} value={PersonTitle[key]}>
                            {PersonTitle[key]}
                          </option>
                        ),
                      )}
                    </Select>
                  </Field>
                  <Field
                    id="person-form-firstName"
                    label={locale.views.person.firstName}
                    name="firstName"
                    required
                  >
                    <Input placeholder={locale.views.person.firstNamePlaceholder} />
                  </Field>
                  <Field
                    id="person-form-middleName"
                    name="middleName"
                    label={locale.views.person.middleName}
                  >
                    <Input placeholder={locale.views.person.middleNamePlaceholder} />
                  </Field>
                  <Field
                    id="person-form-surname"
                    name="surname"
                    label={locale.views.person.surname}
                    required
                  >
                    <Input placeholder={locale.views.person.surnamePlaceholder} />
                  </Field>
                </>
              </FormGroup>
              <div className="start-process__actions">
                <Button
                  disabled={!properties.dirty || !properties.isValid}
                  isLoading={properties.isSubmitting}
                  loadingText={locale.loadingText}
                  type="submit"
                >
                  {locale.next}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
