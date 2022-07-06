import { Route, Switch } from "react-router-dom";

import { TargetType } from "./types";
import { ProcessesMenuView, StartProcessView } from "./views";
import { ProcessLayout } from "./views/process-view/process-layout";

export default function App(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/processes/:processName/start/:targetType/:targetId">
        <StartProcessView />
      </Route>
      {["person", "tenure", "property"].map((targetType) => (
        <Route key={targetType} path={`/processes/${targetType}/:id`}>
          <ProcessesMenuView targetType={targetType as TargetType} />
        </Route>
      ))}
      <Route path="/processes/:processName/:processId">
        <ProcessLayout />
      </Route>
      <Route>
        <div>404</div>
      </Route>
    </Switch>
  );
}
