import {
  getReferenceDataV1,
  mockPersonV1,
  mockProcessV1,
  render,
  server,
} from "@hackney/mtfh-test-utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";

import { processes } from "../../../../../services";
import { tenureInvestigationResultStates } from "../../view-utils";
import { TenureInvestigationResultView } from "./tenure-investigation-result-view";

const options = {
  url: "/processes/changeofname/e63e68c7-84b0-3a48-b450-896e2c3d7735",
  path: "/processes/:processName/:processId",
};

const person = mockPersonV1;

describe("tenure-investigation-result-view", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("check snapshots for each related state", () => {
    tenureInvestigationResultStates.forEach((state) => {
      test(`it renders TenureInvestigationResultView view correctly for ${state} state`, async () => {
        server.use(getReferenceDataV1({}, 200));
        const { container } = render(
          <TenureInvestigationResultView
            processConfig={processes.changeofname}
            process={{
              ...mockProcessV1,
              currentState: {
                ...mockProcessV1.currentState,
                state,
              },
            }}
            mutate={() => {}}
            optional={{ person }}
          />,
          options,
        );
        await waitForElementToBeRemoved(screen.queryAllByText(/Loading/));
        expect(container).toMatchSnapshot();
      });
    });
  });
});
