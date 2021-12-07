import {
  getAssetV1,
  getPersonV1,
  getProcessV1,
  getTenureV1,
  mockProcessV1,
  patchProcessV1,
  postProcessV1,
  server,
} from "@hackney/mtfh-test-utils";

beforeEach(() => {
  server.use(getTenureV1());
  server.use(getPersonV1());
  server.use(getAssetV1());
  server.use(postProcessV1());
  server.use(getProcessV1());
  server.use(patchProcessV1());
});

export const mockProcessSelectTenants = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, stateName: "SelectTenants" },
};

export const mockProcessAutomatedChecksFailed = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, stateName: "AutomatedChecksFailed" },
};

export const mockProcessAutomatedChecksPassed = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, stateName: "AutomatedChecksPassed" },
};

export const mockProcessInvalidState = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, stateName: "InvalidState" },
};
