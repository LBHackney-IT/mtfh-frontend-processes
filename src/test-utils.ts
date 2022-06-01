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
  currentState: { ...mockProcessV1.currentState, state: "SelectTenants" },
};

export const mockProcessAutomatedChecksFailed = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, state: "AutomatedChecksFailed" },
};

export const mockProcessAutomatedChecksPassed = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, state: "AutomatedChecksPassed" },
};

export const mockProcessInvalidState = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, state: "InvalidState" },
};

export const mockManualChecksPassedState = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, state: "ManualChecksPassed" },
};

export const mockManualChecksFailedState = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, state: "ManualChecksFailed" },
};

export const mockBreachChecksFailedState = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, state: "BreachChecksFailed" },
};

export const mockBreachChecksPassedState = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, state: "BreachChecksPassed" },
};

export const mockDocumentsRequestedDes = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, state: "DocumentsRequestedDes" },
};

export const mockProcessClosedState = {
  ...mockProcessV1,
  currentState: { ...mockProcessV1.currentState, state: "ProcessClosed" },
};

export const mockDocumentsRequestedDesAppointment = {
  ...mockProcessV1,
  currentState: {
    ...mockProcessV1.currentState,
    state: "DocumentsRequestedAppointment",
    processData: {
      formData: {
        appointmentDateTime: "2022-10-12T08:59:00.000Z",
      },
      documents: [],
    },
  },
  previousStates: [{ ...mockProcessV1.currentState, state: "DocumentsRequestedDes" }],
};

export const mockDocumentsRequestedAppointment = ({
  appointmentDateTime,
}: {
  appointmentDateTime: string;
}) => {
  return {
    ...mockProcessV1,
    currentState: {
      ...mockProcessV1.currentState,
      state: "DocumentsRequestedAppointment",
      processData: {
        formData: {
          appointmentDateTime,
        },
        documents: [],
      },
    },
  };
};

export const mockDocumentsAppointmentRescheduled = {
  ...mockProcessV1,
  currentState: {
    ...mockProcessV1.currentState,
    state: "DocumentsAppointmentRescheduled",
  },
};
