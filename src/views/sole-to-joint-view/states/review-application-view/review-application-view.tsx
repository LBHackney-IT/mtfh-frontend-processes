import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { SoleToJointHeader } from "../../../../components";
import { locale } from "../../../../services";
import { IProcess } from "../../../../types";
import { CloseProcessView } from "../../shared/close-process-view";
import { HoReviewFailedView } from "../ho-review-view/ho-review-failed-view";
import { HoReviewView } from "../ho-review-view/ho-review-view";
import { NewTenancyView } from "../new-tenancy-view/new-tenancy-view";
import { DesBox, EligibilityChecksPassedBox, TenantContactDetails } from "../shared";
import { TenureInvestigationView } from "../tenure-investigation-view";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Box,
  Center,
  ErrorSummary,
  Link,
  Spinner,
  StatusErrorSummary,
  StatusHeading,
  Text,
} from "@mtfh/common/lib/components";
import { BoxVariant } from "@mtfh/common/lib/components/box";
import { StatusHeadingVariant } from "@mtfh/common/lib/components/status-heading";

const { views } = locale;

interface ReviewApplicationViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  optional?: any;
}
type Recommendation = "approve" | "decline" | "int";
const isCurrentState = (state, process) => state === process.currentState.state;
const isPreviousState = (state, process) =>
  process.previousStates.find((previousState) => state === previousState.state);

const getRecommendation = (
  processConfig: IProcess,
  process: Process,
): {
  recommendation: Recommendation;
  recommendationBoxVariant: BoxVariant;
  recommendationHeadingVariant: StatusHeadingVariant;
} => {
  const { tenureInvestigationFailed, tenureInvestigationPassed } = processConfig.states;
  if (
    isCurrentState(tenureInvestigationFailed.state, process) ||
    isPreviousState(tenureInvestigationFailed.state, process)
  ) {
    return {
      recommendation: "decline",
      recommendationBoxVariant: "warning",
      recommendationHeadingVariant: "warning",
    };
  }
  if (
    isCurrentState(tenureInvestigationPassed.state, process) ||
    isPreviousState(tenureInvestigationPassed.state, process)
  ) {
    return {
      recommendation: "approve",
      recommendationBoxVariant: "success",
      recommendationHeadingVariant: "success",
    };
  }
  return {
    recommendation: "int",
    recommendationBoxVariant: undefined,
    recommendationHeadingVariant: "base",
  };
};

export const ReviewApplicationView = ({
  processConfig,
  process,
  mutate,
  optional,
}: ReviewApplicationViewProps): JSX.Element => {
  const [globalError, setGlobalError] = useState<number>();
  const { closeCase, setCloseCase } = optional;
  const { data: tenure, error } = useTenure(process.targetId);
  const {
    applicationSubmitted,
    tenureInvestigationFailed,
    tenureInvestigationPassed,
    tenureInvestigationPassedWithInt,
    hoApprovalPassed,
    hoApprovalFailed,
    tenureAppointmentScheduled,
    tenureAppointmentRescheduled,
    interviewScheduled,
    interviewRescheduled,
    tenureUpdated,
    processClosed,
  } = processConfig.states;
  const {
    recommendation,
    recommendationBoxVariant,
    recommendationHeadingVariant,
  }: {
    recommendation: Recommendation;
    recommendationBoxVariant: BoxVariant;
    recommendationHeadingVariant: StatusHeadingVariant;
  } = getRecommendation(processConfig, process);

  if (error) {
    return (
      <ErrorSummary
        id="tenure-investigation-view"
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

  return (
    <div data-testid="soletojoint-ReviewApplication">
      <SoleToJointHeader processConfig={processConfig} process={process} />
      {globalError && (
        <StatusErrorSummary id="review-application-global-error" code={globalError} />
      )}
      <EligibilityChecksPassedBox />
      <DesBox title={views.submitCase.supportingDocumentsApproved} />

      {!isCurrentState(applicationSubmitted.state, process) && (
        <Box variant={recommendationBoxVariant}>
          <StatusHeading
            variant={recommendationHeadingVariant}
            title={views.tenureInvestigation.tenureInvestigatorRecommendation(
              recommendation,
            )}
          />
        </Box>
      )}

      {!closeCase &&
        ![
          tenureInvestigationFailed.state,
          tenureInvestigationPassed.state,
          tenureInvestigationPassedWithInt.state,
          interviewScheduled.state,
          interviewRescheduled.state,
          processClosed.state,
        ].includes(process.currentState.state) &&
        (tenant ? (
          <TenantContactDetails tenant={tenant} />
        ) : (
          <Text>Tenant not found.</Text>
        ))}

      {applicationSubmitted.state === process.currentState.state && (
        <TenureInvestigationView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
        />
      )}

      {[
        tenureInvestigationFailed.state,
        tenureInvestigationPassed.state,
        tenureInvestigationPassedWithInt.state,
        interviewScheduled.state,
        interviewRescheduled.state,
      ].includes(process.currentState.state) && (
        <HoReviewView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          optional={{ tenant }}
        />
      )}

      {(isCurrentState(hoApprovalFailed.state, process) ||
        isCurrentState(processClosed.state, process)) && (
        <HoReviewFailedView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
        />
      )}

      {[
        hoApprovalPassed.state,
        tenureAppointmentScheduled.state,
        tenureAppointmentRescheduled.state,
      ].includes(process.currentState.state) && (
        <NewTenancyView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          optional={{ closeCase, setCloseCase }}
        />
      )}

      {isCurrentState(tenureUpdated.state, process) && (
        <Box variant="success">
          <StatusHeading
            variant="success"
            title={views.tenureInvestigation.tenancySigned}
          />
          <div
            style={{ marginLeft: 60, marginTop: 17.5 }}
            className="govuk-link lbh-link lbh-link--no-visited-state"
          >
            <Link as={RouterLink} to="#" variant="link">
              {views.tenureInvestigation.viewNewTenure}
            </Link>
          </div>
        </Box>
      )}

      {(closeCase || isCurrentState(tenureUpdated.state, process)) && (
        <>
          <Box variant="warning">
            <StatusHeading variant="warning" title={views.closeCase.soleToJointClosed} />
          </Box>
          <CloseProcessView
            process={process}
            processConfig={processConfig}
            mutate={mutate}
          />
        </>
      )}
    </div>
  );
};
