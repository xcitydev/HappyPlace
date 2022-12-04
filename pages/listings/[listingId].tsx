import {
  MediaRenderer,
  useContract,
  useListing,
  useNetwork,
  useBuyNow,
  useMakeBid,
  useMakeOffer,
  useOffers,
  useAcceptDirectListingOffer,
  useCancelListing,
  useNetworkMismatch,
  useAddress,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import CountDown from "react-countdown";
import network from "../../utils/network";
import { ethers } from "ethers";
import Link from "next/link";

type Props = {};

const ListingPage = (props: Props) => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const router = useRouter();
  const address = useAddress();
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();
  const [bidAmount, setBidAmount] = useState("");
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  
  const { listingId } = router.query as { listingId: string };
  const { data: offers } = useOffers(contract, listingId);
  const { mutate: makeBid } = useMakeBid(contract);
  const {
    mutate: makeOffer,
    isLoading: isLoadingMakeOffer,
    error: errorMakeOffer,
  } = useMakeOffer(contract);
  const { data: listing, isLoading, error } = useListing(contract, listingId);

  const { mutate: acceptOffer } = useAcceptDirectListingOffer(contract);

   const fetchMinNextBid = async () => {
     if (!listingId || !contract) return;

     const { displayValue, symbol } = await contract.auction.getMinimumNextBid(
       listingId
     );
     setMinimumNextBid({
       displayValue: displayValue,
       symbol: symbol,
     });
   };
     const {
       mutate: buyNow,
       isLoading: isLoadingBuyNow,
       error: errorBuyNow,
     } = useBuyNow(contract);

  useEffect(() => {
    if (!listingId || !contract || !listing) return;

    if (listing.type === ListingType.Auction) {
      fetchMinNextBid();
    }
  }, [listing, listingId, contract]);

 

  const formatPlaceHolder = () => {
    if (!listing) return;

    if (listing.type === ListingType.Direct) {
      return "Enter Offer Amount";
    }
    if (listing.type === ListingType.Auction) {
      return Number(minimumNextBid?.displayValue) === 0
        ? "Enter Bid Amount"
        : `${minimumNextBid?.displayValue}${minimumNextBid?.symbol} or more`;
    }
  };



  const buyNFT = async () => {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }

      if (!listingId || !contract || !listing) return;

      await buyNow(
        {
          id: listingId,
          buyAmount: 1,
          type: listing?.type,
        },
        {
          onSuccess(data, variables, context) {
            alert("NFT Successfully Bought");
            console.log(data, variables, context);
            router.replace("/");
          },
          onError(error, variables, context) {
            alert("NFT could not be Bought");
            console.log("ERROR:", error, variables, context);
          },
        }
      );
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const createBidOrOffer = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (listing?.type === ListingType.Direct) {
      if (
        listing.buyoutPrice.toString() ===
        ethers.utils.parseEther(bidAmount).toString()
      ) {
        console.log("Buy Out price met, buying NFT...");
        buyNFT();
        return;
      }

      console.log("Buy out price was not met");

      await makeOffer(
        {
          quantity: 1,
          listingId,
          pricePerToken: bidAmount,
        },
        {
          onSuccess(data, variables, context) {
            alert("Offer made successfully");
            console.log(data, variables, context);
            setBidAmount("");
          },
          onError(error, variables, context) {
            alert("Offer could not be made");
            console.log("ERROR:", error, variables, context);
          },
        }
      );
    }

    if (listing?.type === ListingType.Auction) {
      console.log("making bid");
      await makeBid(
        {
          listingId,
          bid: bidAmount,
        },
        {
          onSuccess(data, variables, context) {
            alert("Bid made successfully");
            console.log(data, variables, context);
            setBidAmount("");
          },
          onError(error, variables, context) {
            alert("Bid could not be made");
            console.log("ERROR:", error, variables, context);
          },
        }
      );
    }
  };

  const accept = async (listingId: any) => {
    await contract?.auction.buyoutListing(listingId).then((e) => {
      console.log(e);
    });
  };
  if (isLoading)
    return (
      <div>
        <Header />
        <main>
          <p className="text-center animate-pulse text-blue-600">
            Loading Item...
          </p>
        </main>
      </div>
    );
  if (!listing)
    return (
      <div>
        <p>Listing not found!</p>
      </div>
    );
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto flex flex-col lg:flex-row space-y-10 space-x-5 pr-10 py-10">
        <div>
          <MediaRenderer
            className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl"
            src={listing.asset.image}
          />
        </div>
        <section>
          <div className="space-y-2">
            <div>
              <h1 className="font-semibold text-lg">{listing.asset.name}</h1>
              <p className="text-[14px]">{listing.asset.description}</p>
            </div>
            <p className="flex items-center text-xs sm:text-base space-x-1">
              <UserCircleIcon className="h-5" />
              <span className="font-semibold font-Cinzel pr-4">Seller:</span>
              <span className="font-Cinzel text-[14px]">
                {listing.sellerAddress}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-semibold font-Cinzel">Listing Type:</p>
            <p className="text-semibold text-[15px]">
              {listing.type === ListingType.Direct
                ? "Direct Listing"
                : "Auction Listing"}
            </p>
            <p className="font-semibold font-Cinzel">Buy it now price:</p>
            <p className="text-semibold text-[15px]">
              {listing.buyoutCurrencyValuePerToken.displayValue}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
            <button
              onClick={buyNFT}
              className="connectWallet my-4 bg-violet-600"
            >
              Buy Now
            </button>
          </div>

          {listing.type === ListingType.Auction && offers && (
            <div className="grid grid-cols-2 text-[15px] py-3">
              <p className="col-spapn-1 font-semibold py-2">Offers:</p>
              <p>{offers.length > 0 ? offers.length : 0}</p>
              {offers.map((offer) => (
                <>
                  <p className="flex items-center">
                    <UserCircleIcon className="h-3 mr-2" />
                    <span>
                      {offer.offeror.slice(0, 5) +
                        "..." +
                        offer.offeror.slice(-5)}
                    </span>
                  </p>
                  <div className="">
                    <p>
                      {ethers.utils.formatEther(offer.totalOfferAmount)}
                      {""}
                      {NATIVE_TOKENS[network].symbol}
                    </p>
                    {listing.sellerAddress === address && (
                      <button
                        onClick={() =>
                          acceptOffer(
                            {
                              listingId,
                              addressOfOfferor: offer.offeror,
                            },
                            {
                              onSuccess(data, variables, context) {
                                alert("Offer was made successfully");
                                console.log(data, variables, context);
                                router.replace("/");
                              },
                              onError(error, variables, context) {
                                alert("Offer could not be made");
                                console.log(
                                  "ERROR:",
                                  error,
                                  variables,
                                  context
                                );
                              },
                            }
                          )
                        }
                        className="p-2 w-32 cursor-pointer font-bold text-xs bg-red-500/50 rounded-lg"
                      >
                        Accept Offer
                      </button>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}
          <div>
            <hr className="col-span-2" />
            <p className=" py-2 font-semibold text-[14px]">
              {listing.type === ListingType.Direct
                ? "Make an Offer"
                : " Bid on this Auction"}
            </p>

            {listing.type === ListingType.Auction && (
              <>
                <p>Current Minimum Bid:</p>
                <p>
                  {minimumNextBid?.displayValue}
                  {minimumNextBid?.symbol}
                </p>
                <p>Time Remaining:</p>
                <CountDown
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            )}
            {/* Remaining Time for aution */}
            <input
              type="text"
              placeholder={formatPlaceHolder()}
              onChange={(e) => setBidAmount(e.target.value)}
              className="border p-2 rounded-lg mr-5 text-[14px]"
            />
            <button
              onClick={createBidOrOffer}
              className="connectWallet px-[4rem] bg-violet-600"
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
        <Link href="/" className="lg:hidden bg-purple-700 text-white px-2 p-1 w-fit rounded">
          <p>Go Back</p>
        </Link>
      </main>
    </div>
  );
};

export default ListingPage;
