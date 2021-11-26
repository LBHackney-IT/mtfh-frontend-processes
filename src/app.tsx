import { Route, Switch } from "react-router-dom";

import { ProcessesMenuView } from "./views/processes-menu-view";
import { SoleToJointView } from "./views/sole-to-joint-view";

export default function App(): JSX.Element {
  return (
    <Switch>
      <Route
        exact
        path={["/processes/sole-to-joint", "/processes/sole-to-joint/:processId"]}
      >
        <SoleToJointView />
      </Route>
      <Route path="/processes/:entityType/:id">
        <ProcessesMenuView />
      </Route>
      <Route>
        <div>404</div>
      </Route>
    </Switch>
  );
}
