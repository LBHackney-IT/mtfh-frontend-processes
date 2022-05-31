import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../../../services";
import { EligibilityChecksPassedBox } from "../check-eligibility-view/shared";

import {
  Box,
  Button,
  Heading,
  Link,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";

const { views } = locale;
const { submitCase } = views;

export const SubmitCaseView = () => {
  return (
    <>
      <EligibilityChecksPassedBox />
      <Box variant="success">
        <StatusHeading
          variant="success"
          title={views.reviewDocuments.documentsRequested}
        />
        <div
          style={{ marginLeft: 60, marginTop: 17.5 }}
          className="govuk-link lbh-link lbh-link--no-visited-state"
        >
          <Link as={RouterLink} to="#" variant="link">
            {views.reviewDocuments.viewInDes}
          </Link>
        </div>
      </Box>

      <Heading variant="h2">{submitCase.tenureInvestigation}</Heading>
      <Text>{submitCase.disclaimer}</Text>

      <Button>{locale.submitCase}</Button>
    </>
  );
};
