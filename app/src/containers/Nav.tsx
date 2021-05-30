import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Smiler } from "../components/Smiler";
import { UserContext } from "../contexts/UserContext";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const user = useContext(UserContext);
  const location = useLocation();

  const toggleNav = () => setOpen(!open);

  return (
    <>
      <div className={`nav `}>
        {!user?.state.authenticated ? (
          <div className={`nav--link__container ${open ? "open" : "close"}`}>
            <div className="nav--link__wrapper">
              <Link className="nav--link" to="/login">
                Login
              </Link>
            </div>
            <div className="nav--link__wrapper">
              <Link className="nav--link" to="/register">
                Register
              </Link>
            </div>
            <div className="nav--link__wrapper">
              <Link className="nav--link" to="/">
                Events
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {location.pathname !== "/ticket" ? (
              <div
                className={`nav--link__container ${open ? "open" : "close"}`}
              >
                <div className="nav--link__wrapper">
                  <Link className="nav--link" to="/ticket">
                    Ticket
                  </Link>
                </div>
              </div>
            ) : (
              <div
                className={`nav--link__container ${open ? "open" : "close"}`}
              >
                <div className="nav--link__wrapper">
                  <Link className="nav--link" to="/">
                    Events
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="user__box">
          {!user?.state.email && (
            <div className="smiler__container">
              <div className="smiler--small">
                <Smiler />
              </div>
              <div className="smiler--small">
                <Smiler />
              </div>
            </div>
          )}
          <div>{user && user?.state.email}</div>
          {user && user.state.authenticated && (
            <button className="button--sm" onClick={user?.signOut}>
              Logout
            </button>
          )}
        </div>
      </div>
      <button
        onClick={toggleNav}
        className={`dot ${open ? "open" : "close"}`}
      ></button>
    </>
  );
}
