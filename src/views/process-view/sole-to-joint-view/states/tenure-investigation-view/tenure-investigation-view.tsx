import React, { useState } from "react";

import { locale } from "../../../../../services";
import { IProcess } from "../../../../../types";
import { TenantContactDetails } from "../shared";

import { Process, editProcess } from "@mtfh/common/lib/api/process/v1";
import { Button, Checkbox, Text } from "@mtfh/common/lib/components";

const { views } = locale;

interface TenureInvestigationViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
  setGlobalError: any;
  optional?: any;
}

export const TenureInvestigationView = ({
  processConfig,
  process,
  mutate,
  setGlobalError,
  optional,
}: TenureInvestigationViewProps): JSX.Element => {
  const [completed, setCompleted] = useState<boolean>(false);
  const stateConfig = processConfig.states.applicationSubmitted;
  const { tenant } = optional;

  const submit = async (recommendation: string) => {
    try {
      await editProcess({
        id: process.id,
        processName: process?.processName,
        etag: process.etag || "",
        processTrigger: stateConfig.triggers.tenureInvestigation,
        formData: {
          tenureInvestigationRecommendation: recommendation,
        },
        documents: [],
      });
      mutate();
    } catch (e: any) {
      setGlobalError(e.response?.status || 500);
    }
  };

  return (
    <>
      {tenant ? <TenantContactDetails tenant={tenant} /> : <Text>Tenant not found.</Text>}

      <Checkbox
        id="tenure-investigation-completed"
        checked={completed}
        onChange={() => setCompleted(!completed)}
      >
        {views.tenureInvestigation.tenureInvestigationCompleted}
      </Checkbox>
      <Text>{views.tenureInvestigation.recommendation}</Text>
      <Button
        type="submit"
        disabled={!completed}
        onClick={() => submit("approve")}
        style={{ width: 222, marginRight: "100%" }}
      >
        {views.tenureInvestigation.approve}
      </Button>
      <Button
        type="submit"
        disabled={!completed}
        onClick={() => submit("appointment")}
        style={{ width: 222, marginRight: "100%" }}
      >
        {views.tenureInvestigation.appointment}
      </Button>
      <Button
        type="submit"
        disabled={!completed}
        onClick={() => submit("decline")}
        style={{ width: 222, marginRight: "100%" }}
      >
        {views.tenureInvestigation.decline}
      </Button>
    </>
  );
};
