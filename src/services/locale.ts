import reactHtmlParser from "react-html-parser";

import { AssetAddress } from "@mtfh/common/lib/api/asset/v1";

const locale = {
  backButton: "Back",
  bookAppointment: "Book Appointment",
  next: "Next",
  cancel: "Cancel",
  cancelProcess: "Cancel process",
  change: "Change",
  closeCase: "Close Case",
  confirm: "Confirm",
  reason: "Reason",
  reschedule: "Reschedule",
  returnHomePage: "Return to home page",
  submitCase: "Submit case",
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
        reviewApplication: "Review application",
        endCase: "End Case",
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
      viewInDes: "View request in Document Evidence Store",
      useFormBelow: "Use the form below to record the documents you have checked:",
      checkSupportingDocumentsAppointment:
        "I need to make an appointment to check supporting documents",
      seenPhotographicId:
        "I confirm that an outcome letter has been sent to the resident",
      seenPhotographicIdHint: "(for example: valid passport, driving licence)",
      seenSecondId:
        "I confirm I have seen a second form of ID (does not have to be photographic)",
      seenSecondIdHint: "(for example: utility bill, bank statement, council letter)",
      isNotInImmigrationControl:
        "I confirm that the prospective tenant is not subject to immigration control under the Asylum And Immigration Act 1996",
      isNotInImmigrationControlHint:
        "(for example: passport, home office letter, embassy letter, immigration status document)",
      seenProofOfRelationship:
        "I confirm I have seen proof of relationship to the existing tenant",
      seenProofOfRelationshipHint: "(for example: marriage or civil partner certificate)",
      incomingTenantLivingInProperty:
        "I confirm I have seen 3 separate documents proving the proposed tenant has been living at the property for a minimum of 12 months",
      incomingTenantLivingInPropertyHint:
        "(for example: letter, utility bill, council tax bill)",
      soleToJointClosed: "Sole to joint application closed",
      thankYouForConfirmation: "Thank you for confirmation",
      confirmation:
        "The outcome has been recorded and can be viewed in the activity history",
      documentsNotSuitableCloseCase:
        "If the documents are not suitable and all avenues to obtain the right documents have been exhausted, then close the case.",
    },
    submitCase: {
      tenureInvestigation: "Tenure Investigation",
      disclaimer:
        "The Tenure investigation team will now carry out background checks on the tenant and proposed tenant, including a credit check.",
      nextSteps: "Next Steps",
      nextStepsText:
        "Based upon the documents submitted by the tenant and the proposed joint tenant, and the investigation undertaken by the Housing Officer, the application now needs to be assessed by the Tenancy Investigation Team.",
      supportingDocumentsApproved: "Supporting documents approved",
    },
    tenureInvestigation: {
      appointment: "Appointment",
      approve: "Approve",
      decline: "Decline",
      documentsSigned: "Documents signed",
      hoApproved: "Sole to joint tenure application approved",
      hoApprovedNextSteps: "Sole to Joint application approved, next steps:",
      mustMakeAppointment:
        "You must make an office appointment with the applicant to sign a new tenancy agreement",
      recommendation: "Recommendation:",
      showReport: "Show investigator report",
      tenancySigned: "Tenancy signed: tenure created",
      tenureInvestigationCompleted:
        "I confirm that the tenure investigation has been completed",
      tenureInvestigatorRecommendation: (recommendation) =>
        `Tenure investigator recommendation: ${recommendation} application`,
      viewNewTenure: "View new tenure",
    },
    closeCase: {
      reasonForRejection: "Reason for Rejection",
      closeApplication: (processName: string) => `Close ${processName} application?`,
      outcomeLetterSent: "I confirm that an outcome letter has been sent to the resident",
      soleToJointClosed: "Sole to joint tenure application closed",
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
    appointment: {
      scheduled: "Office appointment scheduled",
      missed: "Office appointment missed",
      closeCase: "Office appointment missed - close case",
    },
  },
};

export default locale;
