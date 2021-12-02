import { Link as RouterLink, useParams } from "react-router-dom";

import { ProcessMenu } from "../../components";
import { locale } from "../../services";
import { EntityType } from "../../types";

import { Heading, Layout, Link } from "@mtfh/common/lib/components";

import "./styles.scss";

const { selectProcessDescription, title, backButton } = locale;

export const ProcessesMenuView = () => {
  const { id, entityType } = useParams<{ id: string; entityType: EntityType }>();

  return (
    <Layout data-testid="processes-menu" className="mtfh-processes-menu">
      <Link as={RouterLink} to={`/${entityType}/${id}`} variant="back-link">
        {backButton}
      </Link>
      <Heading as="h1">{title}</Heading>
      <div className="mtfh-processes-menu__description">{selectProcessDescription()}</div>
      <ProcessMenu id={id} entityType={entityType} />
    </Layout>
  );
};
