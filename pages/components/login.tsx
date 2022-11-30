import React from "react";
import { useMetamask, useDisconnect, useAddress } from "@thirdweb-dev/react";

type Props = {};

const Login = (props: Props) => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  return (
    <div>
      <button onClick={address ? disconnect : connectWithMetamask}>
        Connect Metamask
      </button>
    </div>
  );
};

export default Login;
