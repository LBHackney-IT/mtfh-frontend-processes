import { getAssetV1, getPersonV1, getTenureV1, server } from "@hackney/mtfh-test-utils";
import faker from "faker/locale/en";
import { rest } from "msw";

faker.seed(1);

export interface Process {
  id: string;
  targetID: string;
  relatedEntities: string[];
  formData: object;
  documents: string[];
  processName: string;
  currentState: ProcessState;
  previousStates: ProcessState[];
}

export interface ProcessState {
  stateName: string;
  permittedTriggers: string[];
  assignment: string;
  processData: {
    formData: object;
    documents: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export const generateMockProcessV1 = (data: Partial<Process> = {}): Process => {
  return {
    id: faker.datatype.uuid(),
    targetID: faker.datatype.uuid(),
    relatedEntities: Array.from({
      length: faker.datatype.number({ min: 1, max: 4 }),
    }).map(() => faker.lorem.word()),
    formData: {},
    documents: Array.from({ length: faker.datatype.number({ min: 1, max: 4 }) }).map(() =>
      faker.datatype.uuid(),
    ),
    processName: faker.lorem.word(),
    currentState: generateMockProcessStateV1(),
    previousStates: Array.from({ length: faker.datatype.number({ min: 1, max: 4 }) }).map(
      () => generateMockProcessStateV1(),
    ),
    ...data,
  };
};

export const generateMockProcessStateV1 = (
  data: Partial<ProcessState> = {},
): ProcessState => {
  return {
    stateName: faker.lorem.word(),
    permittedTriggers: Array.from({
      length: faker.datatype.number({ min: 1, max: 4 }),
    }).map(() => faker.lorem.word()),
    assignment: faker.lorem.word(),
    processData: {
      formData: {},
      documents: Array.from({ length: faker.datatype.number({ min: 1, max: 4 }) }).map(
        () => faker.datatype.uuid(),
      ),
    },
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
    ...data,
  };
};

export const mockProcessV1 = generateMockProcessV1();

export const postProcessV1 = (data: any = mockProcessV1, code = 200) => {
  return rest.post(`http://localhost/api/v1/process/:processName`, (req, res, ctx) => {
    return res(ctx.status(code), ctx.json(data));
  });
};

beforeEach(() => {
  server.use(getTenureV1());
  server.use(getPersonV1());
  server.use(getAssetV1());
  server.use(postProcessV1());
});
