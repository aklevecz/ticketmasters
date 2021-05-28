import { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import Events from "./containers/Events";
import Login from "./containers/Login";
import Nav from "./containers/Nav";
import Register from "./containers/Register";
import { UserContext } from "./contexts/UserContext";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/" component={Events} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
