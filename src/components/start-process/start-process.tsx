import { useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { locale } from "../../services";
import { IStartProcess } from "../../types";

import { Patch } from "@mtfh/common/lib/api/patch/v1/types";
import { Asset } from "@mtfh/common/lib/api/asset/v1/types";
import { RelatedEntity } from "@mtfh/common/lib/api/process/v1";
import { addProcess } from "@mtfh/common/lib/api/process/v2";
import {
  Button,
  Checkbox,
  InlineField,
  Link,
  StatusErrorSummary,
} from "@mtfh/common/lib/components";

import "./styles.scss";

const { components } = locale;

interface StartProcessProps {
  process: IStartProcess;
  backLink: string;
  processName: string;
  targetId: string;
  targetType: string;
  relatedEntities?: RelatedEntity[];
  patches?: Patch[];
  asset: Asset;
}

export const schema = Yup.object({
  condition: Yup.bool().oneOf([true]),
});

export type FormData = Yup.Asserts<typeof schema>;

export const StartProcess = ({
  processName,
  process,
  backLink,
  targetId,
  targetType,
  relatedEntities = [],
  asset,
  patches,
}: StartProcessProps) => {
  const history = useHistory();
  const [globalError, setGlobalError] = useState<number>();
  const { thirdPartyCondition, thirdPartyComponent, subHeading, subComponent } = process;
  const hasthirdPartyComponent = thirdPartyCondition && thirdPartyComponent;

  const renderComponent = (component) => {
    if (!component) return null;
    const Component = component;
    return <Component />;
  };

  const patch = patches?.[0];
  return (
    <>
      {globalError && (
        <StatusErrorSummary id="start-process-global-error" code={globalError} />
      )}
      <Formik<FormData>
        initialValues={{
          condition: !hasthirdPartyComponent,
        }}
        validateOnChange
        validateOnMount
        validateOnBlur={false}
        validationSchema={schema}
        onSubmit={async () => {
          try {
            const response = await addProcess(
              {
                targetID: targetId,
                targetType,
                relatedEntities,
                patchAssignment: {
                  patchId: patch?.id || "",
                  patchName: patch?.name || "",
                  responsibleEntityId: patch?.responsibleEntities?.[0].id || "",
                  responsibleName: patch?.responsibleEntities?.[0].name || "",
                },
              },
              processName,
            );
            history.push(`/processes/${processName}/${response.id}`);
          } catch (e: any) {
            setGlobalError(e.response?.status || 500);
          }
        }}
      >
        {(properties) => (
          <Form>
            {hasthirdPartyComponent && (
              <>
                <h3>{components.startProcess.thirdPartyHeading}</h3>
                {renderComponent(thirdPartyComponent)}
                <InlineField name="condition" type="checkbox">
                  <Checkbox id="condition">{thirdPartyCondition}</Checkbox>
                </InlineField>
              </>
            )}
            {subHeading && <h3>{subHeading}</h3>}
            {renderComponent(subComponent)}
            <div className="start-process__actions">
              <Button
                disabled={!properties.isValid}
                isLoading={properties.isSubmitting}
                loadingText={locale.loadingText}
                type="submit"
                className="start-process__start-button"
                variant="chevron"
              >
                {components.startProcess.buttonLabel}
              </Button>
              <Link className="start-process__cancel-link" as={RouterLink} to={backLink}>
                {locale.cancel}
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
