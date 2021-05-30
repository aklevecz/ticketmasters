import { createContext, useContext, useEffect, useReducer } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import { discordRefreshTokenExchange } from "../libs/discord";

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
export const buyTicket = firebase.functions().httpsCallable("buyTicket");
export const getUserTicket = firebase
  .functions()
  .httpsCallable("getUserTicket");
export const discordAuth = firebase.functions().httpsCallable("discordAuth");

// if (process.env.NODE_ENV === "development") {
//   firestore.settings({
//     host: "localhost:8080",
//     ssl: false,
//   });
//   // firebase.functions().useEmulator("http://localhost", 5001);
//   firebase.functions().useFunctionsEmulator("http://localhost:5001");
// }

type Action =
  | { type: "SET_USERNAME"; name: string }
  | { type: "AUTHENTICATE"; email: string }
  | {
      type: "DISCORD_AUTH";
      email: string;
      username: string;
      accessToken: string;
      refreshToken: string;
      uid: string;
    }
  | { type: "SET_QR"; qr: string; ticketId: number };

type Dispatch = (action: Action) => void;

type Discord = {
  accessToken: string;
  refreshToken: string;
  username: string;
  email: string;
};

export type State = {
  name: string;
  email: string;
  uid: string;
  authenticated: boolean;
  qr: string;
  ticketId: number;
  discord: Discord;
};

const initialState = {
  name: "",
  email: "",
  uid: "",
  authenticated: false,
  qr: "",
  ticketId: 0,
  discord: {
    accessToken: "",
    refreshToken: "",
    username: "",
    email: "",
  },
};

const DISCORD_REFRESH = "discord_refresh";

const UserContext =
  createContext<
    { state: State; dispatch: Dispatch; signOut: () => void } | undefined
  >(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, name: action.name };
    case "AUTHENTICATE":
      return { ...state, email: action.email, authenticated: true };
    case "DISCORD_AUTH":
      if (action.refreshToken) {
        console.log("setting new token");
        localStorage.setItem(DISCORD_REFRESH, action.refreshToken);
      }
      return {
        ...state,
        email: action.email,
        username: action.username,
        uid: action.uid,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
        authenticated: true,
      };
    case "SET_QR":
      return { ...state, qr: action.qr, ticketId: action.ticketId };
    default:
      return state;
  }
};

const UserProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const signOut = () => {
    auth.signOut();
    localStorage.removeItem(DISCORD_REFRESH);
    window.location.reload();
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem(DISCORD_REFRESH);
    if (refreshToken) {
      discordRefreshTokenExchange(refreshToken)
        .then((data: any) => {
          console.log(data);
          const { dUser, userRecord, tokens, token } = data;
          auth.signInWithCustomToken(token).then(console.log);
          dispatch({
            type: "DISCORD_AUTH",
            email: dUser.email,
            username: dUser.username,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            uid: userRecord.uid,
          });
        })
        .catch(console.log);
    }
    auth.onAuthStateChanged(async function (user) {
      if (user && user.email) {
        dispatch({ type: "AUTHENTICATE", email: user.email });
      }
    });
  }, []);

  const value = { state, dispatch, signOut };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };

export const useRegistration = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("must be within its provider: User");
  }

  const register = (email: string, password: string) => {
    auth.createUserWithEmailAndPassword(email, password).then((cred) => {
      console.log(cred);
    });
  };

  return { register };
};

export const useLogin = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("must be within its provider: User");
  }

  const login = (email: string, password: string) => {
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
      context.dispatch({ type: "AUTHENTICATE", email });
    });
  };

  return { login };
};

export const useTicket = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("must be within its provider: User");
  }
  const dispatch = context.dispatch;
  useEffect(() => {
    if (context.state.authenticated) {
      getUserTicket().then((res) => {
        if (!res.data) {
          return console.log("no ticket");
        }
        dispatch({
          type: "SET_QR",
          qr: res.data.qr,
          ticketId: res.data.ticketId,
        });
      });
    }
  }, [context.state.authenticated, dispatch]);

  return { qr: context.state.qr, ticketId: context.state.ticketId };
};

export const useAuthenticated = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("must be within its provider: User");
  }

  return context.state.authenticated;
};
