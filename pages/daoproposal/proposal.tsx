import React from "react";
import {useContract} from "@thirdweb-dev/react"
type Props = {};

const proposal = (props: Props) => {
  const { contract, isLoading, error } = useContract(
    "{{contract_address}}",
    "nft-drop"
  );
  return <div>proposal</div>;
};

export default proposal;
