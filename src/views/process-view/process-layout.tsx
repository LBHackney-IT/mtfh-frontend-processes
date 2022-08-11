import React, { useEffect, useState } from "react";
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

  const [isCloseProcessDialogOpen, setCloseProcessDialogOpen] = useState<boolean>(false); // used by Close Case button
  const [isCancel, setCancel] = useState<boolean>(false); // used by Cancel Process button
  const [submitted, setSubmitted] = useState<boolean>(false); // used at Finish pages
  const processConfig = processName && processes[processName];
  const { states } = processConfig || {};
  const { processClosed } = states || {};

  const {
    data: process,
    error,
    mutate,
  } = useProcess({
    id: processId,
    processName,
  });

  const [closeProcessReason, setCloseProcessReason] = useState<string>();

  useEffect(() => {
    if (!closeProcessReason) {
      setCloseProcessReason(
        process && processClosed && isSameState(process.currentState, processClosed)
          ? process?.currentState.processData.formData?.reason
          : process?.currentState.processData.formData?.comment,
      );
    }
  }, [process, closeProcessReason, processClosed]);

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
          closeProcessReason={closeProcessReason}
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
          isCancel,
          setCancel,
          setCloseProcessDialogOpen,
          closeProcessReason,
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
