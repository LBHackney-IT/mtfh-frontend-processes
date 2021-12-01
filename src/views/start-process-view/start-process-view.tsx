import { Link as RouterLink, useParams } from "react-router-dom";

import { EntitySummary, StartProcess } from "../../components";
import { locale, processes } from "../../services";
import { EntityType, IProcess } from "../../types";

import { ErrorSummary, Layout, Link } from "@mtfh/common/lib/components";

interface ParamProps {
  entityId: string;
  entityType: EntityType;
  processName: string;
}

export const StartProcessView = () => {
  const { entityId, entityType, processName } = useParams<ParamProps>();

  const SideBar = () => {
    return null;
  };

  const process = Object.values(processes).find(
    (process) => process.urlPath === processName,
  );

  if (!process) {
    return (
      <ErrorSummary
        id="start-process-view"
        title={locale.errors.unableToFindProcess}
        description={locale.errors.unableToFindProcessDescription}
      />
    );
  }

  const { startProcess, title }: IProcess = process;

  const backLink = `/processes/${entityType}/${entityId}`;

  return (
    <Layout
      data-testid={`${processName}-start`}
      sidePosition="right"
      top={
        <>
          <Link as={RouterLink} to={backLink} variant="back-link">
            {locale.backButton}
          </Link>
          <h1 className="lbh-heading-h1">{title}</h1>
        </>
      }
      side={<SideBar />}
    >
      <>
        <EntitySummary type={entityType} id={entityId} />
        <StartProcess
          processName={processName}
          process={startProcess}
          backLink={backLink}
        />
      </>
    </Layout>
  );
};
