import Link from "next/link";
import React from "react";
import { UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Image from "next/image";
type Props = {};

const Header = (props: Props) => {
  const address = useAddress();
  const connectWallet = useMetamask();
  const disconnect = useDisconnect();
  return (
    <div className=" z-50 lg:grid lg:grid-cols-7 flex justify-between grid-cols-6 bg-[#00001F] text-[#FFFFFF] border-b-[1px] py-[1rem] fixed w-[100%]">
      <div className="lg:col-span-1 col-span-2 flex items-center">
        <img
          src="https://gateway.pinata.cloud/ipfs/QmW46oD2ux8gaCTNAKkAK93Hoho1NF2oCxHzLNpMzeh4DU"
          className="lg:w-[50px] w-[30px] h-[30px]"
          alt="logo"
        />
        <Link
          className="font-semibold self-center text-[14px] lg:text-xl font-Poppins"
          href="/"
        >
          <p>HAPPY PLACE</p>
        </Link>
      </div>

      <div className="lg:flex col-span-5 hidden rounded-xl bg-white mx-[2rem] mt-2">
        <MagnifyingGlassIcon className="w-[35px] px-2 text-black" />
        <input
          type="text"
          placeholder="Search for collections and creators"
          className="col-span-4 p-1 flex-1 rounded-xl outline-none text-black"
        />
      </div>

      <div className="flex lg:col-span-1 col-span-2 self-end justify-center items-center HMbtn">
        <UserIcon className="lg:w-[30px] w-[20px] px-1" />
        {address ? (
          <button className="lg:text-[15px] text-[13px] px-2" onClick={disconnect}>
            Hi, {address.slice(0, 4) + "..." + address.slice(-4)}
          </button>
        ) : (
          <p
            className=" col-span-2 text-center text-[14px] cursor-pointer"
            onClick={address ? disconnect : connectWallet}
          >
            Connect Wallet
          </p>
        )}
      </div>
    </div>
  );
};

export default Header;
