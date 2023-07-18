### Overview

This is the Processes micro-frontend for the MTFH project. This app is not intended to be
run in isolation in production, but managed through it's
[root app](https://github.com/LBHackney-IT/mtfh-frontend-root).

### Development of new features and E2E tests											
Part of writing a new feature for this repository involves ensuring the that mtfh-tl-e2e-tests will pass, even if you do not modify or add tests (which you should).											
											
Failure to do this will result in:											
											
- Less test coverage for MMH, adding tech debt, and all other disadvantages that come with untested code;											
- The mtfh-tl-e2e-tests pipeline may end up being BLOCKED by any changes made to MMH, which could affect other developers and ALL future releases on ALL micro-frontends;											
											
Link to the Circle CI `mtfh-tl-e2e-tests` pipeline: https://app.circleci.com/pipelines/github/LBHackney-IT/mtfh-tl-e2e-tests											

### Environment setup

Create a `.env` file in the root of the repo with the following required key-value pairs:

```env
DES_URL=
```

The values can be found in the development AWS account in the Parameter Store (eu-west-2).

### Running it locally

You can either run this application in standalone mode or inside the single SPA "root"
application that provides the header and footer.

- Install all dependencies by running `yarn`.
- Run in standalone mode by running `yarn start:standalone`.
- Run inside the container application by running the root application and running
  `yarn start` on this application.

### Production build

- You can create a production build by running `yarn build`.

### Testing

- You can run the unit tests by running `yarn test`.

### Resources

- [Hackney Design System](https://design-system.hackney.gov.uk/)
- [Single SPA Framework](https://single-spa.js.org/)
