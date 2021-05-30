import { useHistory } from "react-router";
import { useAuthenticated } from "../contexts/UserContext";

export default function Events() {
  const history = useHistory();
  const authenticated = useAuthenticated();
  const goToBuyTicket = () => {
    if (!authenticated) {
      return alert("you must be authenticated first");
    }
    history.push("/buy-ticket");
  };
  return (
    <div className="container">
      <div className="events__block">
        <div className="events__block__name">Secret Campout</div>
        <div className="events__block__date">August 28th</div>
        <div>
          <button className="button--big" onClick={goToBuyTicket}>
            Let's Go
          </button>
        </div>
      </div>
    </div>
  );
}
