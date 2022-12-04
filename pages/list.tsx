import React, { useEffect, useState } from "react";
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
import { NFT, NATIVE_TOKENS, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { GetServerSideProps } from "next";
import { sanityClient } from "../sanity";
import { collectionAddy } from "../typings";
import Header from "./components/header";
import network from "../utils/network";
import { useRouter } from "next/router";
import Login from "./components/login";

const List = () => {
  const router = useRouter();
  const address = useAddress();
  if (!address) return <Login />;
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  // check for network
  const networkMismatch = useNetworkMismatch();

  const [, switchNetwork] = useNetwork();
  // get contracts
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { contract: collectionContract } = useContract(
    "0x949d636c615163155b5e445164e024a6a0f91f70",
    "nft-collection"
  );
  const { contract: dropContract } = useContract(
    process.env.NEXT_PUBLIC_NFT_DROP,
    "nft-drop"
  );

  const { contract: dropContract2 } = useContract(
    process.env.NEXT_PUBLIC_NFT_DROP2,
    "nft-drop"
  );

  // create listing type
  const {
    mutate: createAuctionListing,
    isLoading,
    error,
  } = useCreateAuctionListing(contract);

  const {
    mutate: createDirectListing,
    isLoading: isLoadingAuction,
    error: errorAuction,
  } = useCreateDirectListing(contract);

  // get NFts
  const { data: ownedNfts, isLoading: isLoadingNFT } = useOwnedNFTs(
    collectionContract,
    address
  );
  const { data: ownedNft, isLoading: isLoadingO } = useOwnedNFTs(
    dropContract,
    address
  );
  const { data: ownedNft2, isLoading: isLoading2 } = useOwnedNFTs(
    dropContract2,
    address
  );
  if (!ownedNft) return;
  if (!ownedNft2) return;
  let myNFT = ownedNfts?.concat(ownedNft, ownedNft2);

  // handle listing

  const handleCreateListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!selectedNFT) return;
    console.log(selectedNFT);
    const target = e.target as typeof e.target & {
      elements: {
        listingType: { value: string };
        price: { value: string };
      };
    };

    const { listingType, price } = target.elements;

    if (selectedNFT.metadata.description == "A Xcity Ape") {
      if (listingType.value === "directListing") {
        createDirectListing(
          {
            assetContractAddress: process.env.NEXT_PUBLIC_NFT_DROP!,
            tokenId: selectedNFT.metadata.id,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            listingDurationInSeconds: 60 * 60 * 24 * 7,
            quantity: 1,
            buyoutPricePerToken: price.value,
            startTimestamp: new Date(),
          },
          {
            onSuccess(data, variables, context) {
              console.log(data, variables, context);
              router.push("/");
            },
            onError(error, variables, context) {
              console.log("ERROR:", error, variables, context);
            },
          }
        );
      }
      if (listingType.value === "autionListing") {
        createAuctionListing(
          {
            assetContractAddress: process.env.NEXT_PUBLIC_NFT_DROP!,
            buyoutPricePerToken: price.value,
            tokenId: selectedNFT.metadata.id,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            listingDurationInSeconds: 60 * 60 * 24 * 7,
            quantity: 1,
            startTimestamp: new Date(),
            reservePricePerToken: 0,
          },
          {
            onSuccess(data, variables, context) {
              console.log(data, variables, context);
              router.push("/");
            },
            onError(error, variables, context) {
              console.log("ERROR:", error);
            },
          }
        );
      }
    } else {
      if (listingType.value === "directListing") {
        createDirectListing(
          {
            assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
            tokenId: selectedNFT.metadata.id,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            listingDurationInSeconds: 60 * 60 * 24 * 7,
            quantity: 1,
            buyoutPricePerToken: price.value,
            startTimestamp: new Date(),
          },
          {
            onSuccess(data, variables, context) {
              console.log(data, variables, context);
              router.push("/");
            },
            onError(error, variables, context) {
              console.log("ERROR:", error, variables, context);
            },
          }
        );
      }
      if (listingType.value === "autionListing") {
        createAuctionListing(
          {
            assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
            buyoutPricePerToken: price.value,
            tokenId: selectedNFT.metadata.id,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            listingDurationInSeconds: 60 * 60 * 24 * 7,
            quantity: 1,
            startTimestamp: new Date(),
            reservePricePerToken: 0,
          },
          {
            onSuccess(data, variables, context) {
              console.log(data, variables, context);
              router.push("/");
            },
            onError(error, variables, context) {
              console.log("ERROR:", error);
            },
          }
        );
      }
    }
  };
  console.log(ownedNfts?.concat(ownedNft, ownedNft2), selectedNFT);

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 pt-[6rem]">
        <h1 className="text-4xl font-semibold font-Cinzel pt-3">Dashboard</h1>
        <p>Below you will find the NFTs in your wallet</p>
        <div className="flex overflow-x-scroll space-x-2 p-4">
          {isLoadingNFT ? (
            <div>
              <p>Loading NFTS in your wallet...</p>
            </div>
          ) : (
            <>
              {myNFT?.map((nft, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedNFT(nft)}
                  className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-100 ${
                    nft.metadata.id === selectedNFT?.metadata.id
                      ? "border-violet-600"
                      : "border-transparent"
                  } `}
                >
                  <MediaRenderer
                    className="h-48 rounded-lg"
                    src={nft.metadata.image}
                  />
                  <p className="text-lg truncate font-bold">
                    {nft.metadata.name}
                  </p>
                  <p className="text-xs truncate">{nft.metadata.description}</p>
                </div>
              ))}
            </>
          )}
        </div>
        {selectedNFT && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-5">
                <label className="border-r font-light">
                  Direct Listing / Fixed Price
                </label>
                <input
                  type="radio"
                  name="listingType"
                  value="directListing"
                  className="ml-auto h-10 w-10"
                />
                <label className="border-r font-light">Aution</label>
                <input
                  type="radio"
                  name="listingType"
                  value="autionListing"
                  className="ml-auto h-10 w-10"
                />

                <label className="border-r font-light">Price</label>
                <input
                  type="text"
                  name="price"
                  placeholder="0.05"
                  className="bg-gray-100 p-5"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg mt-8 p-4"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default List;

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "caaddress"][0]{
  addy
  }`;

  const collections = await sanityClient.fetch(query);
  console.log(collections, query, "niceeee");
  return {
    props: {
      collections,
    },
  };
};
