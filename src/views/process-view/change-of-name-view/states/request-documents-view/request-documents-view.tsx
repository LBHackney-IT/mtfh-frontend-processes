import { CheckSupportingDocuments } from "../../../../../components/check-supporting-documents";
import { locale } from "../../../../../services";
import { ProcessComponentProps } from "../../../../../types";
import { BulletWithExplanation } from "../../../shared/process-components";
import { changeOfNameDocuments } from "../../view-utils";

import { Center, Heading, List, Spinner, Text } from "@mtfh/common/lib/components";
import { useErrorCodes } from "@mtfh/common/lib/hooks";

export const RequestDocumentsView = ({
  process,
  mutate,
  optional,
}: ProcessComponentProps): JSX.Element => {
  const errorMessages = useErrorCodes();

  if (!errorMessages) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return !optional.closeProcessReason ? (
    <div data-testid="changeofname-RequestDocuments">
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
          </Text>
          <ol
            className="lbh-body-s"
            type="1"
            style={{ marginLeft: "2em", marginTop: 15, fontWeight: "bold" }}
          >
            {changeOfNameDocuments.map((item) => (
              <li key={item} style={{ marginTop: 0 }}>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </List>

      <CheckSupportingDocuments process={process} mutate={mutate} optional={optional} />
    </div>
  ) : (
    <></>
  );
};
