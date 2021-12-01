import reactHtmlParser from "react-html-parser";

import { AssetAddress } from "@mtfh/common/lib/api/asset/v1";

const locale = {
  backButton: "Back",
  cancel: "Cancel",
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
  menu: {
    description: () =>
      reactHtmlParser(
        "<p>Start a process by selecting a process category below. <br /> Where a process is not yet supported in <strong>Manage My Home</strong> these links will open the appropriate interim Google form.</p>",
      ),
    menuItems: {
      changeToTenancy: "Changes to a tenancy",
      recordTenancy: "Record a tenancy / audit homecheck",
      findLegalReferral: "Find legal referral response",
      requestLegalReferral: "Request a legal referral ",
      recordNoticeServed: "Record notice served",
      rehousing: "Rehousing",
      person: "Person",
      reportJapaneseKnotweed: "Report Japanese knotweed",
      reportOvergrownTree: "Report overgrown tree",
      reportOvergrownGarden: "Report overgrown garden",
    },
  },
  processes: {
    soleToJoint: {
      title: "Sole tenant requests a joint tenure",
    },
  },
};

export default locale;
