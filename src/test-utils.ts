import {
  getAssetV1,
  getPersonV1,
  getTenureV1,
  postProcessV1,
  server,
} from "@hackney/mtfh-test-utils";

beforeEach(() => {
  server.use(getTenureV1());
  server.use(getPersonV1());
  server.use(getAssetV1());
  server.use(postProcessV1());
});
