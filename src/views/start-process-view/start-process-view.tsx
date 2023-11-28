import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { EntitySummary, StartProcess } from "../../components";
import { locale, processes } from "../../services";
import { IProcess, TargetType } from "../../types";

import { Asset } from "@mtfh/common/lib/api/asset/v1/types";
import { Patch } from "@mtfh/common/lib/api/patch/v1/types";
import { RelatedEntity } from "@mtfh/common/lib/api/process/v1";
import { ErrorSummary, Layout, Link } from "@mtfh/common/lib/components";

interface ParamProps {
  targetId: string;
  targetType: TargetType;
  processName: string;
}

export const StartProcessView = () => {
  const { targetId, targetType, processName } = useParams<ParamProps>();
  const [relatedEntities, setRelatedEntities] = useState<RelatedEntity[]>([]);
  const [asset, setAsset] = useState<Asset>();
  const [patch, setPatch] = useState<Patch>();

  const SideBar = () => {
    return null;
  };

  const process = Object.values(processes).find(
    (process) => process.processName === processName,
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

  const backLink = `/processes/${targetType}/${targetId}`;

  return (
    <Layout
      data-testid={`${processName}-start`}
      sidePosition="right"
      backLink={
        <Link as={RouterLink} to={backLink} variant="back-link">
          {locale.backButton}
        </Link>
      }
      top={<h1 className="lbh-heading-h1">{title}</h1>}
      side={<SideBar />}
    >
      <>
        <EntitySummary
          type={targetType}
          id={targetId}
          setRelatedEntities={setRelatedEntities}
          setAsset={setAsset}
          setPatch={setPatch}
        />
        {asset && relatedEntities && patch && (
          <StartProcess
            targetId={targetId}
            processName={processName}
            process={startProcess}
            backLink={backLink}
            targetType={targetType}
            relatedEntities={relatedEntities}
            patches={patch}
            asset={asset}
          />
        )}
      </>
    </Layout>
  );
};
