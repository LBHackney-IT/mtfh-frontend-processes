import { CheckSupportingDocuments } from "../../../../../components/check-supporting-documents";
import { locale } from "../../../../../services";
import { IProcess, ProcessComponentProps } from "../../../../../types";
import { BulletWithExplanation } from "../../../shared/process-components";
import { EligibilityChecksPassedBox } from "../shared";

import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import {
  Center,
  ErrorSummary,
  Heading,
  List,
  Spinner,
  Text,
} from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

export interface RequestDocumentsViewProps extends ProcessComponentProps {
  processConfig: IProcess;
}

export const RequestDocumentsView = ({
  process,
  mutate,
  optional,
}: RequestDocumentsViewProps) => {
  const { closeProcessReason } = optional;
  const errorMessages = useErrorCodes();
  const { data: tenure, error } = useTenure(process.targetId);

  if (error) {
    return (
      <ErrorSummary
        id="request-documents-view"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!tenure || !errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const tenant = tenure?.householdMembers.find((m) => m.isResponsible);

  return (
    <div data-testid="soletojoint-RequestDocuments">
      <EligibilityChecksPassedBox />
      {!closeProcessReason && (
        <>
          <Heading variant="h3">{locale.supportingDocuments}</Heading>
          <Text>
            The following documentation is required from the secure tenant and/or proposed
            tenant, as proof to support their application:
          </Text>
          <List variant="bullets">
            <BulletWithExplanation
              text="Secure and Proposed tenant: Two forms of proof of identity for both the
              secure and proposed tenant. At least one each must be photographic ID"
              explanation="for example: valid passport, driving licence, bank statement, utility bill"
            />
            <BulletWithExplanation
              text="Proposed tenant: Proof of immigration status"
              explanation="for example: passport, home office letter, embassy letter, immigration status document"
            />
            <BulletWithExplanation
              text="Proposed tenant: Proof of relationship to the existing tenant"
              explanation="for example: marriage or civil partner certificate"
            />
            <BulletWithExplanation
              text="Proposed tenant: Proof of co-habitation: three documents proving 12 months
                residency at the property. If marriage certificate provided, any Proof of
                Address can be accepted."
              explanation="for example: letter, utility bill, council tax bill"
            />
          </List>

          <CheckSupportingDocuments
            process={process}
            mutate={mutate}
            optional={{ tenant, declaration: true }}
          />
        </>
      )}
    </div>
  );
};
