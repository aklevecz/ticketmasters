import { useBooped } from "../contexts/ContractContext";
import { useTicket } from "../contexts/UserContext";
import QR from "./QR";

export default function Ticket() {
  const booped = useBooped();
  const { qr, ticketId } = useTicket();

  return (
    <div className="container">
      <div className="ticket__wrapper">
        <div className="h1">Secret Campout</div>
        <div className="h2">August 28th</div>
        <div className="separator"></div>
        <QR
          qr={qr}
          ticketId={ticketId}
          booped={booped}
          canvasClass="contained"
        />
      </div>
    </div>
  );
}
