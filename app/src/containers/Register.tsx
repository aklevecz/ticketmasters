import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import DiscordLogo from "../components/DiscordLogo";
import Input from "../components/Input";
import { UserContext, useRegistration } from "../contexts/UserContext";
import { discordLink } from "./Login";

export default function Register() {
  const [state, setState] = useState({ email: "", password: "" });
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

  const register = useRegistration();
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
              onClick={() => register.register(state.email, state.password)}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
