import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import { sanityClient } from "../../sanity";
import { Collection } from "../../typings";
import { useContract, useAddress } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";

interface Props {
  collections: Collection;
}
const NftDropPage = ({ collections }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<BigNumber>();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [loading, setLoading] = useState(false);
  const [priceInMatic, setPriceInMatic] = useState<string>();
  const address = useAddress();
  const { contract } = useContract(collections.address, "nft-drop");

  const fetchClaimedNftAndSupply = async () => {
    const claimedNFTs = await contract?.totalClaimedSupply();
    const totalNFTSupply = await contract?.totalSupply();
    setClaimedSupply(claimedNFTs);
    setTotalSupply(totalNFTSupply);
    console.log(claimedNFTs?.toString(), "HERE");
  };

  const fetchUnclaimedNFT = async () => {
    const unClaimedNFTs = await contract?.totalSupply();
    console.log(unClaimedNFTs?.toString(), "Unclaimed");
  };

  const fetchPrice = async () => {
    const claimedConditions = await contract?.claimConditions.getAll();
    setPriceInMatic(claimedConditions?.[0].currencyMetadata.displayValue);
  };

  const mintNft = async () => {
    const quantity = 1; // how many unique NFTs you want to claim
    if (!address) return;
    await contract?.claimTo(address, quantity).then(async (tx) => {
      const receipt = tx[0].receipt; // the transaction receipt
      const claimedTokenId = tx[0].id; // the id of the NFT claimed
      const claimedNFT = await tx[0].data();
    });
  };
  useEffect(() => {
    if (!contract) return;
    fetchPrice();
  }, [contract]);

  useEffect(() => {
    if (!contract) return;
    setLoading(true);
    console.log(address);
    fetchClaimedNftAndSupply();
    fetchUnclaimedNFT();
    setLoading(false);
  }, [contract]);

  return (
    <div>
      <p>{collections.title}</p>
      <div>{claimedSupply?.toString()}</div>
      <span>{totalSupply?.toString()}</span>

      <button
        disabled={
          loading ||
          claimedSupply?.toNumber() === totalSupply?.toNumber() ||
          !address
        }
      >
        {loading ? (
          <>Loading</>
        ) : claimedSupply?.toNumber() === totalSupply?.toNumber() ? (
          <>SOLD OUT</>
        ) : !address ? (
          <>Sign in to mint</>
        ) : (
          <span onClick={mintNft}>Mint NFT</span>
        )}
      </button>
    </div>
  );
};

export default NftDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
  ...,
  description,
  creator->{
  ...,
}
            
            
            
  }`;

  const collections = await sanityClient.fetch(query, {
    id: params?.id,
  });
  console.log(collections);
  if (!collections) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collections,
    },
  };
};
