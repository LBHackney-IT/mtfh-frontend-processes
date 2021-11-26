import { useRouteMatch } from "react-router-dom";

import { SoleToJointInitiate } from "../../components/sole-to-joint";

export interface MatchParams {
  processId: string;
}

export const SoleToJointView = () => {
  const { params } = useRouteMatch<MatchParams>();

  if (!params.processId) {
    return <SoleToJointInitiate />;
  }

  return null;
};
