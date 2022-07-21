import React from "react";

import { locale } from "../../../services";
import { isPreviousState } from "../../../utils/processUtil";
import { DesBox } from "../shared/process-components";
import { TenureInvestigationRecommendationBox } from "../sole-to-joint-view/states/shared";
import { tenureInvestigationResultStates } from "./view-utils";

export const StatusBoxes = ({ process, processConfig }) => {
  const { states } = processConfig;
  const { documentsRequestedDes, documentChecksPassed } = states;

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
    </>
  );
};
