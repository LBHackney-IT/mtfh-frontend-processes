import { Form, Formik } from "formik";

import {
  TenantNewNameFormData,
  tenantNewNameSchema,
} from "../../../../../schemas/change-of-name/tenant-new-name";
import { locale } from "../../../../../services";
import { Trigger } from "../../../../../services/processes/types";

import { PersonTitle } from "@mtfh/common/lib/api/person/v1";
import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Field,
  FormGroup,
  Heading,
  Input,
  Select,
  Spinner,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

import "./styles.scss";

interface TenantNewNameViewProps {
  process: Process;
  mutate: () => void;
  setGlobalError: any;
}

export const TenantNewNameView = ({
  process,
  mutate,
  setGlobalError,
}: TenantNewNameViewProps) => {
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <div data-testid="changeofname-EnterNewName">
      <Heading variant="h3">Enter tenant's new name</Heading>
      <Formik<TenantNewNameFormData>
        initialValues={{ title: "", firstName: "", middleName: "", surname: "" }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={tenantNewNameSchema(errorMessages)}
        onSubmit={async (data) => {
          try {
            await editProcess({
              id: process.id,
              processTrigger: Trigger.EnterNewName,
              processName: process?.processName,
              etag: process.etag || "",
              formData: {
                title: data.title,
                firstName: data.firstName,
                middleName: data.middleName,
                surname: data.surname,
              },
              documents: [],
            });
            mutate();
          } catch (e: any) {
            setGlobalError(e.response?.status || 500);
          }
        }}
      >
        {({ dirty, isSubmitting, validateForm }) => {
          return (
            <Form id="person-form" className="mtfh-person-form" noValidate>
              <FormGroup id="person-form-new-tenant-name" name="new-tenant-name">
                <>
                  <Field
                    id="person-form-title"
                    label={locale.views.person.title}
                    name="title"
                    required
                  >
                    <Select
                      data-testid="mtfh-person-form-title"
                      className="mtfh-person-form__input--contained"
                    >
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
                  onClick={() => validateForm()}
                  disabled={!dirty}
                  isLoading={isSubmitting}
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
