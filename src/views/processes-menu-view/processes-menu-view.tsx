import { Link as RouterLink, useParams } from "react-router-dom";

import { ProcessMenu } from "../../components";
import { locale } from "../../services";
import { TargetType } from "../../types";

import { Heading, Layout, Link } from "@mtfh/common/lib/components";

import "./styles.scss";

const { selectProcessDescription, title, backButton } = locale;

export const ProcessesMenuView = () => {
  const { id, targetType } = useParams<{ id: string; targetType: TargetType }>();

  return (
    <Layout data-testid="processes-menu" className="mtfh-processes-menu">
      <Link as={RouterLink} to={`/${targetType}/${id}`} variant="back-link">
        {backButton}
      </Link>
      <Heading as="h1">{title}</Heading>
      <div className="mtfh-processes-menu__description">{selectProcessDescription()}</div>
      <ProcessMenu id={id} targetType={targetType} />
    </Layout>
  );
};
