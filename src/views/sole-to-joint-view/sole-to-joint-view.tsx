import { Route, Switch } from "react-router-dom";

import { SoleToJointInitiate } from "../../components/sole-to-joint";

export const SoleToJointView = () => {
  return (
    <Switch>
      <Route exact path="/processes/:entityType/:id/sole-to-joint/start">
        <SoleToJointInitiate />
      </Route>
      <Route>
        <div>404</div>
      </Route>
    </Switch>
  );
};
