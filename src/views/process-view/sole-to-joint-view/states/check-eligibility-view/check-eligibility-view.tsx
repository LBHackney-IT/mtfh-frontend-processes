import { useState } from "react";

import { locale } from "../../../../../services";
import { IProcess } from "../../../../../types";
import { AutomatedChecksPassedBox } from "../shared";
import { FurtherEligibilityForm } from "./further-eligibility-form";

import { Process } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Heading,
  List,
  StatusErrorSummary,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";

interface CheckEligibilityViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  optional?: any;
}

const { views } = locale;
const { checkEligibility } = views;

export const CheckEligibilityView = ({
  processConfig,
  process,
  mutate,
  optional,
}: CheckEligibilityViewProps) => {
  const [globalError, setGlobalError] = useState<number>();
  const { automatedChecksFailed, automatedChecksPassed, processClosed } =
    processConfig.states;
  const { setSubmitted } = optional;
  const {
    currentState: { state },
  } = process;

  return (
    <div data-testid="soletojoint-CheckEligibility">
      {globalError && (
        <StatusErrorSummary id="check-eligibility-global-error" code={globalError} />
      )}
      <Text>{checkEligibility.autoCheckIntro}</Text>
      {state === automatedChecksPassed.state && (
        <>
          <Heading variant="h5">{checkEligibility.autoCheckInfo}</Heading>
          <AutomatedChecksPassedBox />
          <FurtherEligibilityForm
            processConfig={processConfig}
            process={process}
            mutate={mutate}
            optional={{ setSubmitted }}
            setGlobalError={setGlobalError}
          />
        </>
      )}
      {(state === automatedChecksFailed.state || state === processClosed.state) && (
        <>
          <Heading variant="h5">{checkEligibility.autoCheckInfo}</Heading>
          <Box variant="warning">
            <StatusHeading variant="warning" title={checkEligibility.failedChecks} />
            <div style={{ marginLeft: "60px" }}>
              <Text size="sm">
                All criteria must be passed in order for the applicant to be eligible.
                <br />
                Applicant has failed one or more of the checks listed below.
              </Text>
              <Heading variant="h5">Failed criteria</Heading>
              <List variant="bullets">
                <Text size="sm">
                  Applicant is not a named tenure holder on the tenure
                </Text>
                <Text size="sm">Applicant is already a joint tenant</Text>
                <Text size="sm">
                  Only secure tenures can be changed from a sole to a joint tenancy
                </Text>
                <Text size="sm">
                  Inactive or pending tenures cannot be changed to a joint tenancy
                </Text>
                <Text size="sm">Applicant has rent arrears over £500</Text>
                <Text size="sm">
                  Applicant has a live notice of seeking possession for arrears
                </Text>
                <Text size="sm">Proposed tenants must be over 18 years of age</Text>
                <Text size="sm">
                  Proposed tenant is not a tenure holder or household member within the
                  London Borough of Hackney
                </Text>
              </List>
            </div>
          </Box>
        </>
      )}
    </div>
  );
};
