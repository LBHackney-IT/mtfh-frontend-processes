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
  const { setSubmitted, closeProcessReason } = optional;
  const {
    currentState: { state },
  } = process;

  return (
    <div data-testid="soletojoint-CheckEligibility">
      {globalError && (
        <StatusErrorSummary id="check-eligibility-global-error" code={globalError} />
      )}
      {!closeProcessReason && (
        <>
          <Text>{checkEligibility.autoCheckIntro}</Text>
          {state === automatedChecksPassed.state && (
            <>
              <Heading variant="h4">{checkEligibility.autoCheckInfo}</Heading>
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
        </>
      )}

      {(state === automatedChecksFailed.state || state === processClosed.state) && (
        <>
          <Heading variant="h4">{checkEligibility.autoCheckInfo}</Heading>
          <Box variant="warning">
            <StatusHeading variant="warning" title={checkEligibility.failedChecks} />
            <div style={{ marginLeft: "60px" }}>
              <Text>
                All criteria must be passed in order for the applicant to be eligible.
                <br />
                Applicant has failed one or more of the checks listed below.
              </Text>
              <Heading variant="h4">Failed criteria</Heading>
              <List variant="bullets">
                <Text>Applicant is not a named tenure holder on the tenure</Text>
                <Text>Applicant is already a joint tenant</Text>
                <Text>
                  Only secure tenures can be changed from a sole to a joint tenancy
                </Text>
                <Text>
                  Inactive or pending tenures cannot be changed to a joint tenancy
                </Text>
                <Text>Applicant has rent arrears over £500</Text>
                <Text>Applicant has a live notice of seeking possession for arrears</Text>
                <Text>Proposed tenants must be over 18 years of age</Text>
                <Text>
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
