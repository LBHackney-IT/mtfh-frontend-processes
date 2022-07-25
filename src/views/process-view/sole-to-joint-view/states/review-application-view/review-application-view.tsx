import React, { useState } from "react";

import { locale } from "../../../../../services";
import { IProcess } from "../../../../../types";
import { getPreviousState, isCurrentState } from "../../../../../utils/processUtil";
import { HoReviewFailedView } from "../../../shared/ho-review-view/ho-review-failed-view";
import { HoReviewView } from "../../../shared/ho-review-view/ho-review-view";
import { DesBox } from "../../../shared/process-components";
import { SubmitCaseView } from "../../../shared/submit-case-view";
import { NewTenancyView } from "../new-tenancy-view/new-tenancy-view";
import {
  EligibilityChecksPassedBox,
  TenureInvestigationRecommendationBox,
} from "../shared";
import { TenureInvestigationView } from "../tenure-investigation-view";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Center,
  ErrorSummary,
  Spinner,
  StatusErrorSummary,
} from "@mtfh/common/lib/components";

const { views } = locale;

interface ReviewApplicationViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  optional?: any;
}

export const ReviewApplicationView = ({
  processConfig,
  process,
  mutate,
  optional,
}: ReviewApplicationViewProps): JSX.Element => {
  const [globalError, setGlobalError] = useState<number>();
  const [documentsSigned, setDocumentsSigned] = useState<boolean>(false);
  const { submitted } = optional;
  const { currentState } = process;
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
    processCancelled,
  } = processConfig.states;

  const processState = [processClosed.state, processCancelled.state].includes(
    currentState.state,
  )
    ? getPreviousState(process)
    : currentState;

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

  if (applicationSubmitted.state === currentState.state && submitted) {
    return (
      <SubmitCaseView
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={optional}
      />
    );
  }

  return (
    <div data-testid="soletojoint-ReviewApplication">
      {globalError && (
        <StatusErrorSummary id="review-application-global-error" code={globalError} />
      )}
      <EligibilityChecksPassedBox />
      <DesBox
        title={views.submitCase.supportingDocumentsApproved}
        description={views.submitCase.viewDocumentsOnDes}
      />

      {!isCurrentState(applicationSubmitted.state, process) && (
        <TenureInvestigationRecommendationBox
          processConfig={processConfig}
          process={process}
        />
      )}

      {applicationSubmitted.state === currentState.state && (
        <TenureInvestigationView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          optional={{ tenant }}
        />
      )}

      {[
        tenureInvestigationFailed.state,
        tenureInvestigationPassed.state,
        tenureInvestigationPassedWithInt.state,
        interviewScheduled.state,
        interviewRescheduled.state,
      ].includes(processState.state) && (
        <HoReviewView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          optional={{ ...optional, tenant }}
        />
      )}

      {(isCurrentState(hoApprovalFailed.state, process) ||
        (isCurrentState(processClosed.state, process) &&
          process.previousStates.find(
            (previous) => previous.state === hoApprovalFailed.state,
          ))) && <HoReviewFailedView processConfig={processConfig} process={process} />}

      {[
        hoApprovalPassed.state,
        tenureAppointmentScheduled.state,
        tenureAppointmentRescheduled.state,
        tenureUpdated.state,
      ].includes(processState.state) && (
        <NewTenancyView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          optional={{
            ...optional,
            documentsSigned,
            setDocumentsSigned,
            tenant,
          }}
        />
      )}
    </div>
  );
};
