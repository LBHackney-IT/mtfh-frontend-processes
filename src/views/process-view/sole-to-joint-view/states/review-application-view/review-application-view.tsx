import React, { useState } from "react";

import { CloseProcessView } from "../../../../../components";
import { locale } from "../../../../../services";
import { IProcess } from "../../../../../types";
import { isCurrentState } from "../../../../../utils/processUtil";
import { DesBox } from "../../../shared/process-components";
import { SubmitCaseView } from "../../../shared/submit-case-view";
import { HoReviewFailedView } from "../ho-review-view/ho-review-failed-view";
import { HoReviewView } from "../ho-review-view/ho-review-view";
import { NewTenancyView } from "../new-tenancy-view/new-tenancy-view";
import {
  EligibilityChecksPassedBox,
  TenureInvestigationRecommendationBox,
} from "../shared";
import { TenureInvestigationView } from "../tenure-investigation-view";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Box,
  Center,
  ErrorSummary,
  Spinner,
  StatusErrorSummary,
  StatusHeading,
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
  const { submitted, closeCase, setCloseCase } = optional;
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

  if (applicationSubmitted.state === process.currentState.state && submitted) {
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

      {applicationSubmitted.state === process.currentState.state && (
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
        tenureUpdated.state,
      ].includes(process.currentState.state) && (
        <NewTenancyView
          processConfig={processConfig}
          process={process}
          mutate={mutate}
          setGlobalError={setGlobalError}
          optional={{
            closeCase,
            setCloseCase,
            documentsSigned,
            setDocumentsSigned,
            tenant,
          }}
        />
      )}

      {closeCase && (
        <>
          <Box variant="warning">
            <StatusHeading
              variant="warning"
              title={views.closeProcess.soleToJointClosed}
            />
          </Box>
          <CloseProcessView
            process={process}
            processConfig={processConfig}
            mutate={mutate}
            setGlobalError={setGlobalError}
          />
        </>
      )}
    </div>
  );
};
