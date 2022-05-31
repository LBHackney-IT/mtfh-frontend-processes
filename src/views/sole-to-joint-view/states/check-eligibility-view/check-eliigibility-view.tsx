import { EntitySummary } from "../../../../components";
import { locale } from "../../../../services";
import { IProcess } from "../../../../types";
import { BreachCheckForm } from "./breach-check-form";
import { BreachChecksFailedView } from "./breach-checks-view";
import { FurtherEligibilityForm } from "./further-eligibility-form";
import { RequestDcoumentsView } from "./request-dcouments-view";
import { ReviewDocumentsView } from "./review-documents-view";
import { EligibilityChecksPassedBox, TickBulletPoint } from "./shared";
import { SubmitCaseView } from "./submit-case-view";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Box,
  Button,
  Center,
  ErrorSummary,
  Heading,
  List,
  Spinner,
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

export const CheckEliigibilityView = ({
  processConfig,
  process,
  mutate,
  optional,
}: CheckEligibilityViewProps) => {
  const {
    automatedChecksFailed,
    automatedChecksPassed,
    manualChecksFailed,
    manualChecksPassed,
    breachChecksFailed,
    breachChecksPassed,
    documentsRequestedDes,
    documentsRequestedAppointment,
    documentsAppointmentRescheduled,
    documentChecksPassed,
    applicationSubmitted,
    processCancelled,
    processClosed,
  } = processConfig.states;
  const { data: tenure, error } = useTenure(process.targetId);
  const { furtherEligibilitySubmitted, setFurtherEligibilitySubmitted } = optional;

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

  const tenant = tenure?.householdMembers.find((m) => m.isResponsible);

  const {
    currentState,
    currentState: { state },
  } = process;

  const automatedChecksPassedState = process.previousStates.find(
    (item) => item.state === processConfig.states.automatedChecksPassed.state,
  );

  const incomingTenantId =
    currentState?.processData?.formData?.incomingTenantId ||
    automatedChecksPassedState?.processData?.formData?.incomingTenantId;

  const incomingTenant = incomingTenantId
    ? tenure?.householdMembers.find((m) => m.id === incomingTenantId)
    : undefined;

  return (
    <div data-testid="soletojoint-CheckEligibility">
      <Heading variant="h1">{processConfig.title}</Heading>
      <EntitySummary
        id={process.targetId}
        type={processConfig.targetType}
        config={{ incomingTenant }}
      />
      {![
        breachChecksPassed.state,
        documentsRequestedDes.state,
        documentsRequestedAppointment.state,
        documentsAppointmentRescheduled.state,
        documentChecksPassed.state,
        applicationSubmitted.state,
        processClosed.state,
      ].includes(state) && <Text>{checkEligibility.autoCheckIntro}</Text>}
      {state === breachChecksPassed.state && <EligibilityChecksPassedBox />}
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
          <Button>Close</Button>
        </>
      )}
      {state === manualChecksPassed.state && !furtherEligibilitySubmitted && (
        <BreachCheckForm
          process={process}
          processConfig={processConfig}
          mutate={mutate}
        />
      )}
      {(state === automatedChecksPassed.state || state === manualChecksFailed.state) && (
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
            <TickBulletPoint text="Applicant does not have rent arrears over £500" />
            <TickBulletPoint text="The tenant does not have a live notice seeking possession" />
            <TickBulletPoint text="The proposed tenant is over 18 years of age" />
            <TickBulletPoint text="Proposed tenant is not a tenure holder or household member within the London Borough of Hackney" />
          </Box>
          {state === automatedChecksPassed.state && (
            <FurtherEligibilityForm
              process={process}
              processConfig={processConfig}
              onSuccessfulSubmit={() => {
                mutate();
                setFurtherEligibilitySubmitted(true);
              }}
            />
          )}
          {state === manualChecksFailed.state && (
            <>
              <Box variant="warning">
                <StatusHeading variant="warning" title={checkEligibility.failedChecks} />{" "}
                <div style={{ marginLeft: "60px" }}>
                  <Text size="sm">
                    All criteria must be passed in order for the applicant to be eligible.{" "}
                    <br />
                    Applicant has failed one or more of the further eligibility questions:
                  </Text>
                  <Heading variant="h5">Failed further eligibility question:</Heading>
                  <List variant="bullets">
                    <Text size="sm">
                      The tenant and proposed tenant have not been living together for 12
                      months or more, or are not married or in a civil partnership
                    </Text>
                    <Text size="sm">
                      The tenant or proposed tenant intends to occupy another property as
                      their only or main home
                    </Text>
                    <Text size="sm">Then tenant is a survivor of a joint tenancy</Text>
                    <Text size="sm">
                      The proposed tenant has been evicted by London Borough of Hackney or
                      another local authority or housing association
                    </Text>
                    <Text size="sm">
                      The proposed tenant is subject to immigration control under the
                      Asylum And Immigration Act 1996
                    </Text>
                  </List>
                </div>
              </Box>
              <Button>Close case</Button>
            </>
          )}
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
      {[breachChecksFailed.state, processCancelled.state].includes(state) && (
        <BreachChecksFailedView
          process={process}
          processConfig={processConfig}
          mutate={mutate}
        />
      )}
      {state === breachChecksPassed.state && tenant && (
        <RequestDcoumentsView
          process={process}
          processConfig={processConfig}
          mutate={mutate}
          tenant={tenant}
        />
      )}
      {[
        documentsRequestedAppointment.state,
        documentsRequestedDes.state,
        documentsAppointmentRescheduled.state,
        processClosed.state,
      ].includes(state) &&
        tenant && (
          <ReviewDocumentsView
            process={process}
            processConfig={processConfig}
            mutate={mutate}
          />
        )}
      {[documentChecksPassed.state, applicationSubmitted.state].includes(state) && (
        <SubmitCaseView process={process} processConfig={processConfig} mutate={mutate} />
      )}
    </div>
  );
};
