import { locale } from "../../services";

import { Button, Text } from "@mtfh/common/lib/components";

export const CloseCase = ({ setCloseProcessDialogOpen }): JSX.Element => {
  return (
    <>
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
    </>
  );
};
