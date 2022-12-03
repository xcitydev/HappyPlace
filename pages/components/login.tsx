import React from "react";
import { useMetamask, useDisconnect, useAddress } from "@thirdweb-dev/react";

type Props = {};

const Login = (props: Props) => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  return (
    <>
      <div className="h-[80vh] flex items-center">
        <div className="CM w-[90%] lg:w-[45%]">
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
    </>
  );
};

export default Login;
