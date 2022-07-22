import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../../services";
import { isPreviousState } from "../../../utils/processUtil";
import { DesBox } from "../shared/process-components";
import { TenureInvestigationRecommendationBox } from "../sole-to-joint-view/states/shared";
import { tenureInvestigationResultStates } from "./view-utils";

import { Link, StatusBox, Text } from "@mtfh/common/lib/components";

export const StatusBoxes = ({ process, processConfig }) => {
  const { states } = processConfig;
  const {
    documentsRequestedDes,
    documentChecksPassed,
    hoApprovalFailed,
    hoApprovalPassed,
    nameUpdated,
  } = states;

  const hoApprovalPassedState =
    process.currentState.state === hoApprovalPassed.state
      ? process.currentState
      : process.previousStates.find(
          (previous) => previous.state === hoApprovalPassed.state,
        );

  const hoApprovalFailedState =
    process.currentState.state === hoApprovalFailed.state
      ? process.currentState
      : process.previousStates.find(
          (previous) => previous.state === hoApprovalFailed.state,
        );

  return (
    <>
      {documentChecksPassed.state === process.currentState.state ||
      isPreviousState(documentChecksPassed.state, process) ? (
        <DesBox
          title={locale.views.submitCase.supportingDocumentsApproved}
          description={locale.views.submitCase.viewDocumentsOnDes}
        />
      ) : (
        (documentsRequestedDes.state === process.currentState.state ||
          isPreviousState(documentsRequestedDes.state, process)) && (
          <DesBox title={locale.views.reviewDocuments.documentsRequested} />
        )
      )}

      {(tenureInvestigationResultStates.includes(process.currentState.state) ||
        tenureInvestigationResultStates.find((state) =>
          isPreviousState(state, process),
        )) && (
        <TenureInvestigationRecommendationBox
          processConfig={processConfig}
          process={process}
        />
      )}

      {(hoApprovalPassed.state === process.currentState.state ||
        isPreviousState(hoApprovalPassed.state, process)) && (
        <StatusBox
          variant="success"
          title={locale.views.hoReviewView.hoOutcome(
            locale.views.hoReviewModal[process.processName],
            "approved",
          )}
        >
          {hoApprovalPassedState?.processData.formData.reason && (
            <Text>{hoApprovalPassedState.processData.formData.reason}</Text>
          )}
        </StatusBox>
      )}

      {(hoApprovalFailed.state === process.currentState.state ||
        isPreviousState(hoApprovalFailed.state, process)) && (
        <StatusBox
          variant="warning"
          title={locale.views.hoReviewView.hoOutcome(
            locale.views.hoReviewModal[process.processName],
            "declined",
          )}
        >
          {hoApprovalFailedState?.processData.formData.reason && (
            <Text>{hoApprovalFailedState.processData.formData.reason}</Text>
          )}
        </StatusBox>
      )}

      {(nameUpdated.state === process.currentState.state ||
        isPreviousState(nameUpdated.state, process)) && (
        <StatusBox
          variant="success"
          title={locale.views.tenureInvestigation.tenancySigned}
        >
          <div
            style={{ marginTop: 15 }}
            className="govuk-link lbh-link lbh-link--no-visited-state"
          >
            <Link
              as={RouterLink}
              to={`/tenure/${
                (process.relatedEntities as any[])?.find(
                  (entity) =>
                    entity.targetType === "tenure" && entity.subType === "newTenure",
                )?.id
              }`}
              variant="link"
            >
              {locale.views.tenureInvestigation.viewNewTenure}
            </Link>
          </div>
        </StatusBox>
      )}
    </>
  );
};
