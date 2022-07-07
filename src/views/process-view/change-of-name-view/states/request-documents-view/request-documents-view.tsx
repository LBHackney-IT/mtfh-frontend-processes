import { ChangeOfNameHeader } from "../../../../../components";
import { CheckSupportingDocuments } from "../../../../../components/check-supporting-documents";
import { locale } from "../../../../../services";
import { IProcess, ProcessComponentProps } from "../../../../../types";
import { BulletWithExplanation } from "../../../sole-to-joint-view/states/shared";

import { Center, Heading, List, Spinner, Text } from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

interface RequestDocumentsViewProps extends ProcessComponentProps {
  processConfig: IProcess;
}

export const RequestDocumentsView = ({
  process,
  processConfig,
  mutate,
  optional,
}: RequestDocumentsViewProps): JSX.Element => {
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <div data-testid="changeofname-RequestDocuments">
      <ChangeOfNameHeader processConfig={processConfig} process={process} />

      <Heading variant="h3">{locale.supportingDocuments}</Heading>

      <Text size="sm">
        The tenant needs to provide documents as proof to support their application:
      </Text>
      <List variant="bullets">
        <BulletWithExplanation
          text="Two forms of proof of identity. At least one must be photographic ID. Both must contain the tenants new name"
          explanation="for example: valid passport, driving licence, bank statement, utility bill"
        />
        <div>
          <Text size="sm" style={{ fontWeight: "bold" }}>
            One of the following documents containing the tenant’s new name:
            <ol type="1" style={{ marginLeft: "2em", marginTop: 15 }}>
              {[
                "Marriage certificate",
                "Civil partnership certificate",
                "Decree absolute",
                "Final order",
                "Deed poll document",
                "Statutory declaration",
              ].map((item) => (
                <li key={item} style={{ marginTop: 0 }}>
                  {item}
                </li>
              ))}
            </ol>
          </Text>
        </div>
      </List>

      <CheckSupportingDocuments process={process} mutate={mutate} optional={optional} />
    </div>
  );
};
