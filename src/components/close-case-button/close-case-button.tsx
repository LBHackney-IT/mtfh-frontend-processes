import { locale } from "../../services";

import { Button, Text } from "@mtfh/common/lib/components";

export const CloseCaseButton = ({ setCloseProcessDialogOpen }): JSX.Element => {
  return (
    <div data-testid="close-case-button">
      <Text size="md">{locale.views.reviewDocuments.documentsNotSuitableCloseCase}</Text>
      <Button
        variant="secondary"
        onClick={() => {
          setCloseProcessDialogOpen(true);
        }}
        style={{ width: 222 }}
      >
        {locale.closeCase}
      </Button>
    </div>
  );
};
