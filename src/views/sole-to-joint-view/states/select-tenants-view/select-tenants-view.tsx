import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { EntitySummary } from "../../../../components";
import { locale } from "../../../../services";
import { IProcess } from "../../../../types";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Button,
  Center,
  ErrorSummary,
  FormGroup,
  Heading,
  InlineField,
  Link,
  Radio,
  RadioGroup,
  Spinner,
  StatusErrorSummary,
  Text,
} from "@mtfh/common/lib/components";
import { isUnderAge } from "@mtfh/common/lib/utils";

const { views } = locale;
const { selectTenants } = views;

interface SelectTenantsViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
}

export const schema = Yup.object({
  tenant: Yup.string().required(),
});

export type FormData = Yup.Asserts<typeof schema>;

export const SelectTenantsView = ({
  processConfig,
  process,
  mutate,
}: SelectTenantsViewProps) => {
  const stateConfig = processConfig.states.selectTenants;
  const { data: tenure, error } = useTenure(process.targetId);
  const [globalError, setGlobalError] = useState<number>();

  if (error) {
    return (
      <ErrorSummary
        id="select-tenants-view"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!tenure) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const filteredHouseholdmembers = tenure.householdMembers.filter(
    (member) => !isUnderAge(member.dateOfBirth, 18),
  );

  const tenant = tenure?.householdMembers?.find((e) => e.isResponsible);

  return (
    <div data-testid="soletojoint-SelectTenants">
      <Heading variant="h1">{processConfig.title}</Heading>
      <EntitySummary id={process.targetId} type={processConfig.targetType} />
      {globalError && (
        <StatusErrorSummary id="select-tenant-global-error" code={globalError} />
      )}
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
                tenantId: tenant?.id,
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
        {(properties) => (
          <Form>
            {filteredHouseholdmembers.length === 0 && (
              <Text>{selectTenants.noHouseholdMembersOver18}</Text>
            )}
            {filteredHouseholdmembers.length > 0 && (
              <FormGroup
                id="select-tenant"
                name="tenant"
                label={selectTenants.selectTenantLabel}
                required
                hint={selectTenants.selectTenantHint}
              >
                <RadioGroup>
                  {filteredHouseholdmembers.map((householdMember, index) => (
                    <InlineField key={index} name="tenant" type="radio">
                      <Radio
                        id={`select-tenant-${householdMember.id}`}
                        value={householdMember.id}
                      >
                        {householdMember.fullName}
                      </Radio>
                    </InlineField>
                  ))}
                </RadioGroup>
              </FormGroup>
            )}
            <Text>
              {selectTenants.addToTenureText}{" "}
              <Link
                as={RouterLink}
                to={`/tenure/${process.targetId}/edit/person`}
                isExternal
              >
                {selectTenants.addToTenureLink}
              </Link>
              .
            </Text>
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
        )}
      </Formik>
    </div>
  );
};
