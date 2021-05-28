import { useEffect } from "react";
import "./App.css";
const discordLink =
  "https://discord.com/api/oauth2/authorize?client_id=847701412002660362&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code&scope=identify%20email";
const tokenUrl = "https://discord.com/api/oauth2/token";
function App() {
  const connectDiscord = () => {
    window.location.href = discordLink;
  };
  useEffect(() => {
    const code = window.location.search.replace("?code=", "");
    console.log(code);
    const client_id = "847701412002660362";
    const client_secret = "tIdB27NpG88weILAwAtEMr0OpIh5CnNO";
    const grant_type = "authorization_code";
    const redirect_uri = "http://localhost:3000/callback";

    fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        grant_type,
        redirect_uri,
      }),
    })
      .then((r) => r.json())
      .then(console.log)
      .catch(console.log);
  }, []);
  return (
    <div className="App">
      <button onClick={connectDiscord}>connect discord</button>
    </div>
  );
}

export default App;
