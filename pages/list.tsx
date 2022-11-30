import React from "react";
import {
  MediaRenderer,
  useAddress,
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
} from "@thirdweb-dev/react";

type Props = {};

const list = (props: Props) => {
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { contract: collectionContract } = useContract(
    "0x949d636c615163155b5e445164e024a6a0f91f70",
    "nft-collection"
  );
  const { data: ownedNfts, isLoading: isLoadingNFT } = useOwnedNFTs(
    collectionContract,
    address
  );
  console.log(ownedNfts);
  return <div>list</div>;
};

export default list;
