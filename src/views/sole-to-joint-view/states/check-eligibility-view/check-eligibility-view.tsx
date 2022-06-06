import { Link as RouterLink } from "react-router-dom";

import { SoleToJointHeader } from "../../../../components";
import { locale } from "../../../../services";
import { IProcess } from "../../../../types";
import { BreachCheckForm } from "../breach-checks-view/breach-check-form";
import { FurtherEligibilityForm } from "./further-eligibility-form";
import { TickBulletPoint } from "./shared";

import { Process } from "@mtfh/common/lib/api/process/v1";
import {
  Box,
  Button,
  Heading,
  Link,
  List,
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
  const {
    automatedChecksFailed,
    automatedChecksPassed,
    manualChecksPassed,
    breachChecksPassed,
    processClosed,
  } = processConfig.states;
  const { furtherEligibilitySubmitted, setFurtherEligibilitySubmitted } = optional;

  const {
    currentState: { state },
  } = process;

  return (
    <div data-testid="soletojoint-CheckEligibility">
      <SoleToJointHeader processConfig={processConfig} process={process} />
      {![breachChecksPassed.state, processClosed.state].includes(state) && (
        <Text>{checkEligibility.autoCheckIntro}</Text>
      )}
      {state === manualChecksPassed.state && furtherEligibilitySubmitted && (
        <>
          <Heading variant="h3">Next Steps:</Heading>
          <Text size="sm">
            The current tenant and the applicant have passed the initial eligibility
            requirements. The next steps are:
          </Text>
          <List variant="bullets">
            <Text size="sm">Background checks carried out by the Housing Officer</Text>
            <Text size="sm">A check carried out by the Tenancy Investigation Team</Text>
            <Text size="sm">
              If successful the tenant and proposed tenant will need to sign a new tenancy
              agreement
            </Text>
          </List>
          <div style={{ marginTop: "1em" }}>
            <Link as={RouterLink} to="" variant="back-link">
              Return to home page
            </Link>
          </div>
        </>
      )}
      {state === manualChecksPassed.state && !furtherEligibilitySubmitted && (
        <BreachCheckForm
          process={process}
          processConfig={processConfig}
          mutate={mutate}
        />
      )}
      {state === automatedChecksPassed.state && (
        <>
          <Heading variant="h5">
            This is an automated check based on the data the system has. At this stage,
            the system does not have all the data required to make a decision, so these
            results are for guidance only and do not reflect accurate information.
          </Heading>
          <Box variant="success">
            <Heading variant="h4" style={{ marginBottom: "0.5em" }}>
              {checkEligibility.passedChecks}
            </Heading>
            <TickBulletPoint text="Applicant is a named tenure holder on the tenure" />
            <TickBulletPoint text="Applicant is currently a sole tenant" />
            <TickBulletPoint text="Secure tenures can be changed from a sole to joint tenancy" />
            <TickBulletPoint text="Tenant's tenure is active" />
            <TickBulletPoint text="The proposed tenant is over 18 years of age" />
            <TickBulletPoint text="Proposed tenant is not a tenure holder or household member within the London Borough of Hackney" />
          </Box>
          <FurtherEligibilityForm
            process={process}
            processConfig={processConfig}
            onSuccessfulSubmit={() => {
              mutate();
              setFurtherEligibilitySubmitted(true);
            }}
          />
        </>
      )}
      {state === automatedChecksFailed.state && (
        <>
          <Heading variant="h5">
            This is an automated check based on the data the system has. At this stage,
            the system does not have all the data required to make a decision, so these
            results are for guidance only and do not reflect accurate information.
          </Heading>
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
          <Button>Close case</Button>
        </>
      )}
    </div>
  );
};
