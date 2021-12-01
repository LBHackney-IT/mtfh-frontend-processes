import { useParams } from "react-router-dom";

export const SoleToJointView = () => {
  const { processId } = useParams<{ processId: string }>();

  return <div>{processId}</div>;
};
