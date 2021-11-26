import reactHtmlParser from "react-html-parser";

const locale = {
  backButton: "Back",
  title: "Processes",
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
