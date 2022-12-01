import React from "react";
import { useMetamask, useDisconnect, useAddress } from "@thirdweb-dev/react";

type Props = {};

const Login = (props: Props) => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  return (
    <div className="tr">
      <header>
        <div className="logo">A</div>
        <a href="">Login</a>
      </header>
      <div className="CM">
        <div className="CMtext">
          <h1>Welcome to Happy Place Marketplace</h1>
          <h2>Connect Wallet to Enter</h2>
        </div>
        <button
          className="CMbtn"
          onClick={address ? disconnect : connectWithMetamask}
        >
          Connect Metamask
        </button>
      </div>
    </div>
  );
};

export default Login;
