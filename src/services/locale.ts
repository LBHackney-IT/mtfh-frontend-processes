import reactHtmlParser from "react-html-parser";

import { AssetAddress } from "@mtfh/common/lib/api/asset/v1";

const locale = {
  backButton: "Back",
  bookAppointment: "Book Appointment",
  next: "Next",
  cancel: "Cancel",
  cancelProcess: "Cancel process",
  change: "Change",
  views: {
    soleToJoint: {
      title: "Sole tenant requests a joint tenure",
      steps: {
        selectTenant: "Select person",
        checkEligibility: "Eligibility Checks",
        supportingDocuments: "Supporting documents",
        finish: "Finish",
        breachOfTenancy: "Breach of tenure check",
        requestDocuments: "Request Documents",
        reviewDocuments: "Review Documents",
        submitCase: "Submit case",
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
    breachOfTenancy: {
      autoCheckIntro:
        "Manage My Home has used tenure, person and property information to automatically check eligibility for this application.",
      passedChecks: "Eligibility checks passed",
      failedChecks: "Not eligible for a sole to joint tenure",
    },
    reviewDocuments: {
      passedChecks: "Eligibility checks passed",
      documentsRequested: "Documents requested",
      checkSupportingDocumentsAppointment:
        "I need to make an appointment to check supporting documents",
      appointmentScheduled: "Office appointment scheduled",
      seenPhotographicId:
        "I confirm that an outcome letter has been sent to the resident",
      seenSecondId:
        "I confirm I have seen a second form of ID (does not have to be photographic)",
      isNotInImmigrationControl:
        "I confirm that the prospective tenant is not subject to immigration control under the Asylum And Immigration Act 1996",
      seenProofOfRelationship:
        "I confirm I have seen proof of relationship to the existing tenant",
      incomingTenantLivingInProperty:
        "I confirm I have seen 3 separate documents proving the proposed tenant has been living at the property for a minimum of 12 months",
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
