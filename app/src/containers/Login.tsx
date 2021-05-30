import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import DiscordLogo from "../components/DiscordLogo";
import Input from "../components/Input";
import { useLogin, UserContext } from "../contexts/UserContext";

export const discordLink =
  "https://discord.com/api/oauth2/authorize?client_id=847701412002660362&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code&scope=identify%20email";

export default function Login() {
  const [state, setState] = useState({ email: "", password: "" });
  const login = useLogin();
  const user = useContext(UserContext);
  const history = useHistory();

  const connectDiscord = () => {
    window.location.href = discordLink;
  };

  const handleChange = (e: any) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (user && user.state.authenticated) {
      history.push("/");
    }
  }, [user, history]);

  return (
    <div className="container">
      <div className="auth__wrapper">
        <button
          className="button--big button--discord"
          onClick={connectDiscord}
        >
          <div>
            <div>Connect</div>
            <div>
              <DiscordLogo />
            </div>
          </div>
        </button>
        <div className="separator"></div>
        <div className="form">
          <div>
            <Input name="email" handleChange={handleChange} />
          </div>
          <div>
            <Input name="password" handleChange={handleChange} />
          </div>
          <div>
            <button
              className="button--md"
              onClick={() => login.login(state.email, state.password)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
