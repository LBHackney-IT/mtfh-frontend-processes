import React, { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import {
  ChangeOfNameSideBar,
  ChangeOfNameView,
  SoleToJointSideBar,
  SoleToJointView,
} from "..";
import { CloseProcessDialog } from "../../components";
import { locale, processes } from "../../services";
import { CommentsView } from "./shared/comments-view/comments-view";

import { useProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Center,
  ErrorSummary,
  Heading,
  Layout,
  Link,
  Spinner,
} from "@mtfh/common/lib/components";

const components = {
  [processes.soletojoint.processName]: SoleToJointView,
  [processes.changeofname.processName]: ChangeOfNameView,
};

const sidebars = {
  [processes.soletojoint.processName]: SoleToJointSideBar,
  [processes.changeofname.processName]: ChangeOfNameSideBar,
};

const isSameState = (firstState, secondState) => {
  return firstState.state === secondState.state;
};

export const ProcessLayout = (): JSX.Element => {
  const { processId, processName } =
    useParams<{ processId: string; processName: string }>();

  const [isCloseProcessDialogOpen, setCloseProcessDialogOpen] = useState<boolean>(false);
  const [closeProcessReason, setCloseProcessReason] = useState<string>();
  const [isCancel, setCancel] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [closeCase, setCloseCase] = useState<boolean>(false);

  const {
    data: process,
    error,
    mutate,
  } = useProcess({
    id: processId,
    processName,
  });

  if (error) {
    return (
      <ErrorSummary
        id="sole-to-joint-view"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!process) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const Component = components[processName];
  const Sidebar = sidebars[processName];

  if (!Component) {
    return (
      <ErrorSummary
        id="process-layout-error"
        title={locale.errors.unableToFindState}
        description={locale.errors.unableToFindStateDescription}
      />
    );
  }

  const processConfig = processName && processes[processName];
  const { states } = processConfig;
  const { processClosed } = states;

  let closeProcessReasonFinal = closeProcessReason;
  if (!closeProcessReasonFinal && isSameState(process.currentState, processClosed)) {
    closeProcessReasonFinal = process.currentState.processData.formData.Reason;
  }

  return (
    <Layout
      data-testid="process-layout"
      sidePosition="right"
      backLink={
        <Link
          as={RouterLink}
          to={`/processes/${processName}/start/${process.targetType}/${process.targetId}`}
          variant="back-link"
        >
          {locale.backButton}
        </Link>
      }
      side={
        <Sidebar
          process={process}
          submitted={submitted}
          closeCase={closeCase}
          setCloseProcessDialogOpen={setCloseProcessDialogOpen}
          setCancel={setCancel}
        />
      }
    >
      <Heading variant="h1">{processConfig.title}</Heading>
      <Component
        process={process}
        mutate={mutate}
        optional={{
          submitted,
          setSubmitted,
          closeCase,
          setCloseCase,
          setCancel,
          setCloseProcessDialogOpen,
          closeProcessReasonFinal,
        }}
      />

      <CloseProcessDialog
        isCloseProcessDialogOpen={isCloseProcessDialogOpen}
        setCloseProcessDialogOpen={setCloseProcessDialogOpen}
        setCloseProcessReason={setCloseProcessReason}
        mutate={mutate}
        isCancel={isCancel}
      />

      <hr className="divider" />
      <CommentsView targetType="process" targetId={processId} mutate={mutate} />
    </Layout>
  );
};
