import reactHtmlParser from "react-html-parser";

import { AssetAddress } from "@mtfh/common/lib/api/asset/v1";

const locale = {
  backButton: "Back",
  next: "Next",
  cancel: "Cancel",
  cancelProcess: "Cancel process",
  views: {
    soleToJoint: {
      title: "Sole tenant requests a joint tenure",
      steps: {
        selectTenant: "Select person",
        checkEligibility: "Eligibility Checks",
        supportingDocuments: "Supporting documents",
        finish: "Finish",
      },
      actions: {
        reassignCase: "Reassign case",
        cancelProcess: "Cancel process",
        caseActivityHistory: "Case activity history",
      },
    },
    selectTenants: {
      selectTenantHint:
        "This person will be asked for proof of relationship e.g. marriage or civil partnership certificate.",
      selectTenantLabel: "Who do you want to add as a joint tenant?",
      addToTenureText: "If the person you want to add is not listed you must first",
      addToTenureLink: "add them to the tenure",
      noHouseholdMembersOver18:
        "There are no household members over the age of 18 associated to this.",
    },
    processesMenu: {
      selectProcessDescription: () =>
        reactHtmlParser(
          "<p>Start a process by selecting a process category below. <br /> Where a process is not yet supported in <strong>Manage My Home</strong> these links will open the appropriate interim Google form.</p>",
        ),
    },
    checkEligibility: {
      autoCheckIntro:
        "Manage My Home has used tenure, person and property information to automatically check eligibility for this application.",
      passedChecks: "Passed automatic eligibilty checks",
      failedChecks: "Not eligible for a sole to joint tenure",
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
