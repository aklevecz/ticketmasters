import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import "./styles/events.css";
import "./styles/nav.css";
import "./styles/form.css";
import "./styles/canvas.css";
import "./styles/ticket.css";
import BuyTicket from "./containers/BuyTicket";
import Callback from "./containers/Callback";
import Events from "./containers/Events";
import Login from "./containers/Login";
import Nav from "./containers/Nav";
import Register from "./containers/Register";
import Ticket from "./containers/Ticket";
import TicketMasterLogo from "./components/TicketMasterLogo";

function App() {
  return (
    <div className="App">
      <Router>
        <TicketMasterLogo />
        <Nav />
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/callback" component={Callback} />
          <Route path="/buy-ticket" component={BuyTicket} />
          <Route path="/ticket" component={Ticket} />
          <Route path="/" component={Events} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
