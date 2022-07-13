import { CloseProcessView } from "../../../../../components";
import { locale } from "../../../../../services";
import { IProcess } from "../../../../../types";

import { Process } from "@mtfh/common/lib/api/process/v1";
import { Box, StatusHeading } from "@mtfh/common/lib/components";

const { views } = locale;
interface HoReviewFailedViewProps {
  processConfig: IProcess;
  process: Process;
  mutate: () => void;
}

export const HoReviewFailedView = ({
  processConfig,
  process,
  mutate,
}: HoReviewFailedViewProps): JSX.Element => {
  return (
    <>
      <Box variant="warning">
        <StatusHeading
          variant="warning"
          title={views.hoReviewView.hoOutcome("declined")}
        />
      </Box>

      <CloseProcessView
        process={process}
        processConfig={processConfig}
        mutate={mutate}
        optional={{ nextStepsDescription: false }}
      />
    </>
  );
};
