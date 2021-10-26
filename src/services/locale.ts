import reactHtmlParser from "react-html-parser";

const locale = {
  backButton: "Back",
  title: "Processes",
  menu: {
    description: () =>
      reactHtmlParser(
        "<p>Start a process by selecting a process category below. <br /> Where a process is not yet supported in <strong>Manage My Home</strong> these links will open the appropriate interim Google form.</p>",
      ),
  },
};

export default locale;
