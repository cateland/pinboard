import { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Layout } from "antd";

import { AppMenu } from "./views/components/AppMenu";
import { Pinboard } from "./views/pages/Pinboard";
import { Documents } from "./views/pages/Documents";
import * as daeGraph from "./domain/graph/daeGraph";
import "./App.css";

function App() {
  const [pinboard, updatePinboard] = useState(daeGraph.initialGraph);
  return (
    <Router>
      <Layout style={{height:"100vh"}}>
        <AppMenu />
        <Switch>
          <Route path="/pinboard">
            <Pinboard pinboard={pinboard} />
          </Route>
          <Route path="/documents">
            <Documents pinboard={pinboard} updatePinboard={updatePinboard} />
          </Route>
          <Redirect from="/" to="/documents" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
