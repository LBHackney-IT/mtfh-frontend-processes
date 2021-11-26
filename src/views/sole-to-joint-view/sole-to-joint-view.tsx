import { useParams } from "react-router-dom";

import { SoleToJointInitiate } from "../../components/sole-to-joint";

export const SoleToJointView = () => {
  const { processId } = useParams<{ processId: string }>();

  if (!processId) {
    return <SoleToJointInitiate />;
  }

  return null;
};
