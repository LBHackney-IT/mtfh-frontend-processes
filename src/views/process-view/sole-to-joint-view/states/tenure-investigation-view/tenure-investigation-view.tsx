import React from "react";

import { ContactDetails } from "../../../../../components";
import { TenureInvestigationForm } from "../../../shared/tenure-investigation-form";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { Text } from "@mtfh/common/lib/components";

interface TenureInvestigationViewProps {
  process: Process;
  mutate: () => void;
  setGlobalError: any;
  optional?: any;
}

export const TenureInvestigationView = ({
  process,
  mutate,
  setGlobalError,
  optional,
}: TenureInvestigationViewProps): JSX.Element => {
  const { tenant } = optional;

  return (
    <div data-testid="soletojoint-tenure-investigation">
      {tenant ? (
        <ContactDetails fullName={tenant.fullName} personId={tenant.id} />
      ) : (
        <Text>Tenant not found.</Text>
      )}
      <TenureInvestigationForm
        process={process}
        mutate={mutate}
        setGlobalError={setGlobalError}
      />
    </div>
  );
};
