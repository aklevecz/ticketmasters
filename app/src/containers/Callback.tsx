import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { auth, discordAuth, UserContext } from "../contexts/UserContext";
const baseUrl = "https://discord.com/api";
export default function Callback() {
  const user = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    const code = window.location.search.replace("?code=", "");
    if (!code) return;
    discordAuth({ code, grant_type: "authorization_code" })
      .then((response: any) => {
        const {
          data: { tokens, dUser, userRecord, token },
        } = response;
        auth.signInWithCustomToken(token).then(console.log);
        user &&
          user.dispatch({
            type: "DISCORD_AUTH",
            email: dUser.email,
            username: dUser.username,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            uid: userRecord.uid,
          });
        history.push("/");
      })
      .catch(console.log);
  }, []);
  return <div>hi</div>;
}
