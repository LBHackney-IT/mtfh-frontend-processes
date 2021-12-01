import { Link as RouterLink, useParams } from "react-router-dom";

import { EntitySummary, StartProcess } from "../../components";
import { locale, processes } from "../../services";

import { ErrorSummary, Layout, Link } from "@mtfh/common/lib/components";

function snakeToCamel(string: string) {
  return string.replace(/(-\w)/g, (arr) => arr[1].toUpperCase());
}

interface ParamProps {
  entityId: string;
  entityType: "tenure" | "property" | "person";
  processName: string;
}

export const StartProcessView = () => {
  const { entityId, entityType, processName } = useParams<ParamProps>();

  const SideBar = () => {
    return null;
  };

  const process = processes[snakeToCamel(processName)];

  if (!process) {
    return (
      <ErrorSummary
        id="start-process-view"
        title={locale.errors.unableToFindProcess}
        description={locale.errors.unableToFindProcessDescription}
      />
    );
  }

  const { startProcess, name } = process;

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
          <h1 className="lbh-heading-h1">{name}</h1>
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