import { useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { locale } from "../../services";
import { IStartProcess } from "../../types";

import { addProcess } from "@mtfh/common/lib/api/process/v1";
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
            // todo: revert this change after process BE is ready
            if (processName === "changeofname") {
              history.push(
                `/processes/${processName}/02373a9d-d0da-4cd0-8633-c0335397e7cf`,
              );
            } else {
              const response = await addProcess({ targetID: targetId }, processName);
              history.push(`/processes/${processName}/${response.id}`);
            }
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
