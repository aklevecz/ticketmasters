import "./App.css";
import QrReader from "react-qr-reader";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

var firebaseConfig = {
  apiKey: "AIzaSyCz55PzxSz1vhuhxVdlLJh7-tZ4mlM1Hlw",
  authDomain: "ticketmasters.firebaseapp.com",
  projectId: "ticketmasters",
  storageBucket: "ticketmasters.appspot.com",
  messagingSenderId: "736326223361",
  appId: "1:736326223361:web:c8657a7150c71bf3ea2200",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
export const auth = firebase.auth();

export const boopTicket = firebase.functions().httpsCallable("boopTicket");

// if (process.env.NODE_ENV === "development") {
//   firestore.settings({
//     host: "localhost:8080",
//     ssl: false,
//   });
//   firebase.functions().useEmulator("192.168.1.124", 5001);
//   // firebase.functions().useFunctionsEmulator("https://192.168.1.124:5001");
// }

function App() {
  const [state, setState] = useState({ result: "" });

  const handleScan = (data: any) => {
    if (data) {
      boopTicket(data);
      setState({ result: data });
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  // useEffect(() => {
  //   const code =
  //     "cf1bef6214f68501e3733afea7a4706f9fc70306d45e773cffe8bcac836648db";
  //   boopTicket(code);
  // }, []);

  return (
    <div className="App">
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      <div>{state.result}</div>
    </div>
  );
}

export default App;
