import { buyTicket } from "../../contexts/UserContext";
import QR from "../QR";
import { useState } from "react";

export default function BuyTicket() {
  const [qr, setQR] = useState("");
  // const { qr, ticketId } = useTicket();

  const getTicket = () => {
    buyTicket("teemo").then((res: any) => {
      console.log(res);
      setQR(res.data);
    });
  };
  return (
    <div className="container">
      <div className="user__box">
        {!qr && (
          <>
            <div className="h1">Create a Ticket?</div>
            <button className="button--big" onClick={getTicket}>
              Create
            </button>
          </>
        )}
        {qr && <QR qr={qr} canvasClass={"contained"} />}
      </div>
    </div>
  );
}
