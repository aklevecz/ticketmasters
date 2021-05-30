import { createContext, useContext, useEffect, useReducer } from "react";
import { ethers } from "ethers";
import { buyTicket, UserContext } from "./UserContext";
import TicketMasterInterface from "../contracts/contracts/TicketMaster.sol/TicketMaster.json";

declare global {
  interface Window {
    ethereum: any;
  }
}
const TM_ADDRESS = "0x5BCefE9f11D2C70171a7a2Cc284A846C13AAB082";

type Action =
  | {
      type: "INIT_CONTRACT";
      contract: ethers.Contract;
      signer: ethers.providers.JsonRpcSigner;
      account: string;
      provider: ethers.providers.Web3Provider;
    }
  | { type: "SET_BOOPED"; booped: boolean };

type Dispatch = (action: Action) => void;

export type State = {
  contract: ethers.Contract | undefined;
  signer: ethers.providers.JsonRpcSigner | undefined;
  booped: boolean | undefined;
  account: string | undefined;
  provider: ethers.providers.Web3Provider | undefined;
};

const initialState = {
  contract: undefined,
  signer: undefined,
  booped: undefined,
  account: "",
  provider: undefined,
};

const ContractContext =
  createContext<
    | {
        state: State;
        dispatch: Dispatch;
        createTicket: () => void;
      }
    | undefined
  >(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "INIT_CONTRACT":
      return {
        ...state,
        contract: action.contract,
        signer: action.signer,
        account: action.account,
        provider: action.provider,
      };
    case "SET_BOOPED":
      return { ...state, booped: action.booped };
    default:
      return state;
  }
};

const ContractProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initTMContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      TM_ADDRESS,
      TicketMasterInterface.abi,
      provider
    );
    console.log(await contract.balanceOf(accounts[0]));
    dispatch({
      type: "INIT_CONTRACT",
      contract,
      signer,
      account: accounts[0],
      provider,
    });
  };

  const createTicket = () => {
    // if (!state.contract || !state.signer) {
    //   console.log("bada");
    //   return;
    // }
    // const contractSigner = state.contract.connect(state.signer);
    // contractSigner.createTicket(state.account, "uri");
    buyTicket().then(console.log).catch(console.log);
  };

  useEffect(() => {
    initTMContract();
  }, []);

  const value = { state, dispatch, createTicket };
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export { ContractContext, ContractProvider };

export const useBooped = () => {
  const context = useContext(ContractContext);
  const user = useContext(UserContext);

  if (!context) {
    throw new Error("not inside context");
  }

  const { state, dispatch } = context;

  useEffect(() => {
    if (user?.state.ticketId) {
      state.contract &&
        state.contract.booped(user.state.ticketId).then((booped: boolean) => {
          dispatch({ type: "SET_BOOPED", booped });
        });
    }
  }, [user, dispatch, state.contract]);

  const provider = context.state.provider;
  const contractI = state.contract;
  useEffect(() => {
    if (!contractI || !provider) {
      return;
    }
    const event = contractI.filters.TicketBooped();
    const filter = {
      address: contractI.address,
      topics: event.topics,
    };
    console.log("LISTENING TO EVENT");
    provider.on(filter, (log, event) => {
      const parsedLog = contractI.interface.parseLog(log);
      if (parsedLog.name === "TicketBooped") {
        dispatch({ type: "SET_BOOPED", booped: true });
      }
    });
  }, [contractI, provider, dispatch]);

  return context.state.booped;
};
