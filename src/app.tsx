import { Route, Switch } from "react-router-dom";

import { ProcessesView } from "./views/processes-view";

export default function App(): JSX.Element {
  return (
    <Switch>
      <Route path="/processes">
        <ProcessesView />
      </Route>
    </Switch>
  );
}
