import { Route, Switch } from "react-router-dom";

import { ProcessesMenuView } from "./views/processes-menu-view";
import { SoleToJointView } from "./views/sole-to-joint-view";
import { StartProcessView } from "./views/start-process-view";

export default function App(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/processes/:processName/start/:entityType/:entityId">
        <StartProcessView />
      </Route>
      <Route path="/processes/sole-to-joint/:processId">
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
