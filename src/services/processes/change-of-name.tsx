import { IProcess, IStartProcess } from "../../types";
import locale from "../locale";

import { Text } from "@mtfh/common/lib/components";

const startProcess: IStartProcess = {
  thirdPartyComponent: () => {
    return (
      <Text>
        By starting this process the tenant must agree that information relating to this
        application can be shared with third parties, for instance to perform a credit
        check.
      </Text>
    );
  },
  thirdPartyCondition:
    "I have explained to the tenant that their information will be shared with third parties.",
  subHeading: locale.supportingDocuments,
  subComponent: () => {
    return (
      <div>
        <Text>
          The applicant will be asked to provide documents as evidence to support their
          application.
        </Text>
      </div>
    );
  },
};

export const changeOfName: IProcess = {
  processName: "changeOfName",
  targetType: "person",
  title: locale.views.changeOfName.title,
  startProcess,
  states: {},
};
