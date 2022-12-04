import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import { useContract, useAddress, useMetamask } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import Header from "../components/header";
import twitterLogo from "../assets/tw.png";
import {
  HomeIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

interface Props {
  collections: Collection;
}
const NftDropPage = ({ collections }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<BigNumber>();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [loading, setLoading] = useState(false);
  const [priceInMatic, setPriceInMatic] = useState<string>();
  const address = useAddress();
  const connectWallet = useMetamask();
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
    console.log(contract);
    fetchClaimedNftAndSupply();
    fetchUnclaimedNFT();
    setLoading(false);
  }, [contract]);

  return (
    // <p>{collections.title}</p>
    //   <div>{claimedSupply?.toString()}</div>
    //   <span>{totalSupply?.toString()}</span>
    //   <img src={urlFor(collections.mainImage).url()} alt="" />

    //   <button
    //     disabled={
    //       loading ||
    //       claimedSupply?.toNumber() === totalSupply?.toNumber() ||
    //       !address
    //     }
    //   >
    //     {loading ? (
    //       <>Loading</>
    //     ) : claimedSupply?.toNumber() === totalSupply?.toNumber() ? (
    //       <>SOLD OUT</>
    //     ) : !address ? (
    //       <>Sign in to mint</>
    //     ) : (
    //       <span onClick={mintNft}>Mint NFT</span>
    //     )}
    //   </button>
    <div>
      <Header />

      <div className="pt-[5rem]">
        <div className="w-[16%] fixed h-[90vh] border-r-2 border-black p-[2rem] whiteSmoke space-y-5">
          <Link
            href="/list"
            className="flex items-center space-x-3 cols p-2 rounded textF  hover:px-4 transition-all"
          >
            <HomeIcon width="30px" />
            <p>Dashboard</p>
          </Link>
          <Link
            href="/daoproposal/proposal"
            className="flex items-center space-x-3 cols p-2 rounded textF  hover:px-4 transition-all"
          >
            <UserGroupIcon width="30px" />
            <p>DAO Voting</p>
          </Link>
          <Link
            href="/launchpad/launchpad"
            className="flex items-center space-x-3 cols p-2 rounded textF  hover:px-4 transition-all"
          >
            <RectangleGroupIcon width="30px" />
            <p>LaunchPad</p>
          </Link>
          <Link
            href="/launchpad/launchpad"
            className="flex items-center space-x-3 cols p-2 rounded textF  hover:px-4 transition-all"
          >
            <QuestionMarkCircleIcon width="30px" />
            <p>Support</p>
          </Link>
        </div>
        <div className="text-white bg-[#00001f] nft mt-[40px] rounded w-[80%] ml-[17%] mr-[6%] my-auto px-[1rem]">
          <div className="flex pt-[1rem]">
            <div className="py-[2rem] px-[1rem] space-y-3 w-[45%] h-[50vh]">
              <p className="text-4xl font-semibold font-Cinzel">
                {collections.nftCollectionName}
              </p>
              <p>{collections.description}</p>
              <div className="grid grid-cols-2 space-x-3">
                <div className="flex font-Cinzel text-[13px] items-center justify-between bg-yellow-800 col-span-1 p-1 rounded-sm">
                  <p>Total Items</p>
                  <p>{totalSupply?.toString()}</p>
                </div>
                <div className="flex font-Cinzel text-[13px] items-center justify-between bg-yellow-800 col-span-1 p-1 rounded-sm">
                  <p>Price</p>
                  <p>
                    {priceInMatic} <span className="text-[12px]">Matic</span>
                  </p>
                </div>
              </div>
              <div className="space-x-2 text-[13px]">
                <span>
                  {claimedSupply?.toString() + "/" + totalSupply?.toString()}
                </span>
                <span>MINTED</span>
              </div>
              <div>
                <button
                  disabled={
                    loading ||
                    claimedSupply?.toNumber() === totalSupply?.toNumber() ||
                    !address
                  }
                >
                  {loading ? (
                    <p className="text-[13px] font-Cinzel bg-red-500 p-2 rounded mt-[2rem]">
                      Loading
                    </p>
                  ) : claimedSupply?.toNumber() === totalSupply?.toNumber() ? (
                    <p className="text-[13px] font-Cinzel bg-red-500 p-2 rounded mt-[2rem]">
                      SOLD OUT
                    </p>
                  ) : !address ? (
                    <p
                      onClick={connectWallet}
                      className=" cursor-pointer text-[13px] font-Cinzel bg-red-500 p-2 rounded mt-[2rem]"
                    >
                      Sign in to mint
                    </p>
                  ) : (
                    <span
                      onClick={mintNft}
                      className="text-[13px] font-Cinzel cursor-pointer bg-red-500 p-2 rounded mt-[2rem]"
                    >
                      Mint NFT
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="py-[1rem] shadow-2xl w-[55%] h-[50vh] flex justify-end">
              <img
                className=" rounded-lg w-[80%] h-[48vh] py-[0.5rem]"
                src={urlFor(collections.mainImage).url()}
                alt="nftimage"
              />
            </div>
          </div>
        </div>
      </div>
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
