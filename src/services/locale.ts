import reactHtmlParser from "react-html-parser";

import { AssetAddress } from "@mtfh/common/lib/api/asset/v1";

const locale = {
  backButton: "Back",
  next: "Next",
  cancel: "Cancel",
  views: {
    soleToJoint: {
      steps: {
        selectTenant: "Select person",
        checkEligibility: "Eligibility Checks",
        supportingDocuments: "Supporting documents",
        breachOfTenureCheck: "Breach of tenure check",
        estateSafetyTeamChecks: "Estate Safety team checks",
        housingOfficerReview: "Housing Officer review",
      },
    },
    selectTenants: {
      noHouseholdMembersOver18:
        "There are no household members over the age of 18 associated to this.",
    },
    processesMenu: {
      selectProcessDescription: () =>
        reactHtmlParser(
          "<p>Start a process by selecting a process category below. <br /> Where a process is not yet supported in <strong>Manage My Home</strong> these links will open the appropriate interim Google form.</p>",
        ),
    },
  },
  errors: {
    unableToFetchRecord: "There was a problem retrieving the record",
    unableToFetchRecordDescription:
      "Please try again. If the issue persists, please contact support.",
    unableToFindProcess: "Invalid Process",
    unableToFindProcessDescription: "We have been unable to find a process of this type.",
    unableToFindState: "Invalid State",
    unableToFindStateDescription: "We have been unable to process a state of this type.",
  },
  title: "Processes",
  loadingText: "Submitting...",
  components: {
    startProcess: {
      buttonLabel: "Start process",
      thirdPartyHeading: "Sharing information with third parties",
    },
    entitySummary: {
      tenurePaymentRef: "Tenure payment ref",
      address: (assetAddress: AssetAddress): string => {
        const {
          postPreamble,
          addressLine1,
          addressLine2,
          addressLine3,
          addressLine4,
          postCode,
        } = assetAddress;

        return [
          postPreamble,
          addressLine1,
          addressLine2,
          addressLine3,

          addressLine4,
          postCode,
        ]
          .filter((addressLine) => !!addressLine)
          .join(" ");
      },
    },
  },
};

export default locale;
