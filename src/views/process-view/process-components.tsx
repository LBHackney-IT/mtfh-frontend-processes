import { Link as RouterLink } from "react-router-dom";

import { config, locale } from "../../services";

import { Box, Link, StatusHeading, Text } from "@mtfh/common/lib/components";

const { views } = locale;

export const TickIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35 15.5127L18.775 33L11 24.6201L14.2591 21.1074L18.775 25.9746L31.7409 12L35 15.5127Z"
        fill="#00664F"
      />
    </svg>
  );
};

export const TickBulletPoint = ({ text }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "0 0 0 -7px" }}>
      <TickIcon />
      <Text size="sm" style={{ margin: 0 }}>
        {text}
      </Text>
    </div>
  );
};

export const BulletWithExplanation = ({ text, explanation }) => {
  return (
    <>
      <Text size="sm" style={{ fontWeight: "bold" }}>
        {text}
      </Text>
      <span className="lbh-body-s">({explanation})</span>
    </>
  );
};

export const DesBox = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}): JSX.Element => {
  return (
    <Box variant="success">
      <StatusHeading variant="success" title={title} />
      <div
        style={{ marginLeft: 60, marginTop: 17.5 }}
        className="govuk-link lbh-link lbh-link--no-visited-state"
      >
        <Link
          as={RouterLink}
          to={{
            pathname: `${config.desURL}/teams/1/dashboard/requests`,
          }}
          target="_blank"
          variant="link"
        >
          {description || views.reviewDocuments.viewInDes}
        </Link>
      </div>
    </Box>
  );
};
