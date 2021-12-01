import { Link as RouterLink, useHistory } from "react-router-dom";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { locale } from "../../services";

import { Button, Checkbox, Link } from "@mtfh/common/lib/components";

import "./styles.scss";

const { components } = locale;

interface StartProcessProps {
  process: {
    thirdPartyCondition: string;
    ThirdPartyContent: any;
    riskHeading: string;
    RiskContent: any;
  };
  backLink: string;
  processName: string;
}

export const schema = Yup.object({
  condition: Yup.bool().oneOf([true]),
});

export type FormData = Yup.Asserts<typeof schema>;

export const StartProcess = ({ processName, process, backLink }: StartProcessProps) => {
  const history = useHistory();
  const { thirdPartyCondition, ThirdPartyContent, riskHeading, RiskContent } = process;
  const hasThirdPartyContent = !!thirdPartyCondition;

  return (
    <Formik<FormData>
      initialValues={{
        condition: !hasThirdPartyContent,
      }}
      validateOnChange
      validateOnMount
      validateOnBlur={false}
      validationSchema={schema}
      onSubmit={() => {
        history.push(`/processes/${processName}/generated-id`);
      }}
    >
      {(properties) => (
        <Form>
          {hasThirdPartyContent && (
            <>
              <h3>{components.startProcess.thirdPartyHeading}</h3>
              <ThirdPartyContent />
              <Checkbox onChange={properties.handleChange} id="condition">
                {thirdPartyCondition}
              </Checkbox>
            </>
          )}
          <h3>{riskHeading}</h3>
          <RiskContent />
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
  );
};
