import locale from "../locale";

import { Link, Text } from "@mtfh/common/lib/components";

export const soleToJoint = {
  name: locale.processes.soleToJoint.title,
  startProcess: {
    ThirdPartyContent: () => {
      return (
        <Text>
          By starting this process the tenant and proposed tenant must agree that
          information relating to this application will be shared with third parties, for
          instance to perform a credit check.
        </Text>
      );
    },
    thirdPartyCondition:
      "I have explained to the tenant and proposed tenant that their information will be shared with third parties.",
    riskHeading: "Sole to joint tenure application risks",
    RiskContent: () => {
      return (
        <div>
          <Text>
            A joint tenancy is when two or more adults (aged 18 or over) are named on the
            tenure agreement. Joint tenants have equal rights and responsibilities under
            the tenure agreement for the duration of the tenancy.
          </Text>
          <Text>
            Joint tenants are both responsible, together and individually, for keeping to
            these tenure conditions and payments to the London borough of Hackney.
            Applying for a joint tenancy is at the discretion of the Housing team.
          </Text>
          <h4>Things to consider if joint tenants separate</h4>
          <Text>
            If a joint tenants relationship ends, discussions should be made about what
            will happen to the tenure.
          </Text>
          <Text>The tenant and proposed tenant need to understand:</Text>
          <ul className="lbh-list lbh-list--bullet">
            <li>When can they end a joint tenure</li>
            <li>
              What will happen if they end a joint tenure but one of the tenants remains
              at the property
            </li>
          </ul>
          <Text>
            This information is available on the{" "}
            <Link isExternal href="https://hackney.gov.uk/your-tenancy-agreement">
              terms and conditions of the tenancy
            </Link>
          </Text>
        </div>
      );
    },
  },
};
