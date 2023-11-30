import { useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { locale } from "../../services";
import { IStartProcess } from "../../types";

import { Asset } from "@mtfh/common/lib/api/asset/v1/types";
import { usePatchOrArea } from "@mtfh/common/lib/api/patch/v1";
import { PostProcessRequestData, RelatedEntity } from "@mtfh/common/lib/api/process/v1";
import { PostProcessRequestDataV2, addProcess } from "@mtfh/common/lib/api/process/v2";
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

  const { data: patch } = usePatchOrArea(asset.patchId);
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
          if (!patch) {
            console.error("No patch found");
            return;
          }
          try {
            const ppReqData: PostProcessRequestData = {
              targetType,
              relatedEntities,
              targetID: targetId,
            };

            const requestData: PostProcessRequestDataV2 = {
              ...ppReqData,
              patchAssignment: {
                patchId: patch.id || "",
                patchName: patch.name || "",
                responsibleEntityId: patch.responsibleEntities?.[0].id || "",
                responsibleName: patch.responsibleEntities?.[0].name || "",
              },
            };

            const response = await addProcess(requestData, processName);
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
