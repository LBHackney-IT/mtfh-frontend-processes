import reactHtmlParser from "react-html-parser";

import { AssetAddress } from "@mtfh/common/lib/api/asset/v1";

const supportingDocuments = "Supporting documents";

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
  supportingDocuments,
  views: {
    person: {
      title: "Title",
      titlePlaceholder: "Select Title",
      firstName: "First name",
      firstNamePlaceholder: "Enter first name",
      middleName: "Middle name",
      middleNamePlaceholder: "Enter Middle name",
      surname: "Last name",
      surnamePlaceholder: "Enter last name",
    },
    soleToJoint: {
      title: "Sole tenant requests a joint tenure",
      steps: {
        selectTenant: "Select person",
        checkEligibility: "Eligibility Checks",
        supportingDocuments,
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
    changeofname: {
      title: "Change of Name",
      steps: {
        tenantsNewName: "Tenant's new name",
        requestDocuments: "Request Documents",
        reviewDocuments: "Review Documents",
        submitCase: "Submit case",
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
      addToTenureLink: "add them as a household member",
      noHouseholdMembersOver18:
        "There are no household members over the age of 18 associated to this Tenancy.",
    },
    processesMenu: {
      selectProcessDescription: () =>
        reactHtmlParser(
          "<p>Start a process by selecting a process category below. <br /> Where a process is not yet supported in <strong>Manage My Home</strong> these links will open the appropriate interim Google form.</p>",
        ),
    },
    checkEligibility: {
      autoCheckInfo:
        "This is an automated check based on the data the system has. At this stage, the system does not have all the data required to make a decision, so these results are for guidance only and do not reflect accurate information.",
      autoCheckIntro:
        "Manage My Home has used tenure, person and property information to automatically check eligibility for this application.",
      passedChecks: "Passed automatic eligibility checks",
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
      seenPhotographicId: "I confirm I have seen a government issue photographic ID",
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
      soleToJointWillBeClosed: "Sole to joint application will be closed",
      soleToJointClosed: "Sole to joint application closed",
      confirmation:
        "The outcome has been recorded and can be viewed in the activity history",
      documentsNotSuitableCloseCase:
        "If the documents are not suitable and all avenues to obtain the right documents have been exhausted, then close the case.",
      confirmationForValidDocuments:
        "I confirm I have seen a valid example of one of the following documents",
      marriageCertificate: "Marriage certificate",
      civilPartnershipCertificate: "Civil partnership certificate",
      decreeAbsolute: "Decree absolute",
      finalOrder: "Final order",
      deedPollDocument: "Deed poll document",
      statuoryDeclaration: "Statutory declaration",
    },
    submitCase: {
      tenureInvestigation: "Tenure Investigation",
      disclaimer:
        "The Tenure investigation team will now carry out background checks on the tenant and proposed tenant, including a credit check.",
      nextSteps: "Next Steps",
      nextStepsText:
        "Based upon the documents submitted by the tenant and the proposed joint tenant, and the investigation undertaken by the Housing Officer, the application now needs to be assessed by the Tenancy Investigation Team.",
      supportingDocumentsApproved: "Supporting documents approved",
      viewDocumentsOnDes: "View documents on the Document Evidence Store",
    },
    tenureInvestigation: {
      appointment: "Appointment",
      approve: "Approve",
      decline: "Decline",
      documentsSigned: "Documents signed",
      hoApprovedNextSteps: "Sole to Joint application approved, next steps:",
      mustMakeAppointment:
        "You must make an office appointment with the applicant to sign a new tenancy agreement",
      recommendation: "Recommendation:",
      showReport: "Show investigator report",
      tenancySigned: "Tenancy signed: Tenure created",
      tenureInvestigationCompleted:
        "I confirm that the tenure investigation has been completed",
      tenureInvestigatorRecommendation: (recommendation) => {
        return `Tenure investigator recommendation: ${
          recommendation === "Int"
            ? "Interview Applicant"
            : `${recommendation} application`
        }`;
      },
      viewNewTenure: "View new tenure",
    },
    hoReviewView: {
      makeAppointment: "Make an appointment with the applicant for an interview",
      appointmentContactDetails:
        "To make an appointment with the applicant for an interview, please use the following details:",
      receivedDecision: "The case has received Area Housing Manager’s final decision.",
      passedForReview:
        "I have passed the case to the Area Housing Manager for review and received a decision",
      confirmInstructionReceived:
        "I confirm that this is an instruction received by the Area Housing Manager",
      managersName: "Enter manager's name",
      hoOutcome: (decision) => `Sole to joint tenure application ${decision}`,
    },
    closeProcess: {
      reasonForCancellation: "Reason for Cancellation",
      reasonForCloseCase: "Reason for close case",
      outcomeLetterSent: "I confirm that an outcome letter has been sent to the resident",
      soleToJointClosed: "Sole to joint tenure application closed",
      confirmationText:
        "This case is now closed and we have recorded this on the system - that you have sent an outcome letter to the resident. The outcome can be viewed in the activity history.",
      thankYouForConfirmation: "Thank you for your confirmation",
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
