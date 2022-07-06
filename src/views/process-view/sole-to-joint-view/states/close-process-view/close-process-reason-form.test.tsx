import React, { useState } from "react";

import { render } from "@hackney/mtfh-test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, Formik } from "formik";

import { locale } from "../../../../../services";
import {
  CloseProcessFormData,
  CloseProcessReasonForm,
  closeProcessSchema,
} from "./close-process-reason-form";

import { Button } from "@mtfh/common/lib/components";
import commonLocale from "@mtfh/common/lib/locale";

const mockErrorMessages = commonLocale.hooks.defaultErrorMessages;

const Component = ({
  initialValues,
  isCancel = false,
}: {
  initialValues?: Partial<CloseProcessFormData>;
  isCancel: boolean;
}): JSX.Element => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <div>Success</div>;
  }

  return (
    <Formik
      initialValues={{
        reasonForRejection: "",
        ...initialValues,
      }}
      validationSchema={closeProcessSchema(mockErrorMessages)}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={() => {
        setSubmitted(true);
      }}
    >
      {() => (
        <Form noValidate data-testid="form">
          <CloseProcessReasonForm isCancel={isCancel} />
          <Button type="submit">{locale.confirm}</Button>
        </Form>
      )}
    </Formik>
  );
};

test("it renders correctly for Cancel Process", () => {
  const { container } = render(<Component isCancel />);
  expect(container).toMatchSnapshot();
});

test("it renders correctly Close Process", () => {
  const { container } = render(<Component isCancel={false} />);
  expect(container).toMatchSnapshot();
});

test("it fails validation if submitted without interaction", async () => {
  render(<Component isCancel />);
  await userEvent.click(screen.getByText(locale.confirm));
  await screen.findByText("Error", { exact: false });
});

test("it submits with correct required fields", async () => {
  render(<Component isCancel />);
  const reasonForRejection = screen.getByLabelText(
    `${locale.views.closeProcess.reasonForCancellation}*`,
  );
  await userEvent.type(reasonForRejection, "Documents not provided");
  await userEvent.click(screen.getByText(locale.confirm));
  await screen.findByText("Success");
});
