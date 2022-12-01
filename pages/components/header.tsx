import Link from "next/link";
import React from "react";
import { UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
type Props = {};

const Header = (props: Props) => {
  const address = useAddress();
  const disconnect = useDisconnect();
  return (
    <div className="grid grid-cols-7 bg-[#00001F] text-[#FFFFFF] border-b-[1px] py-[1rem]">
      <p className="font-semibold col-span-1 pl-[1rem] self-center text-xl font-Cinzel">
        HAPPY PLACE
      </p>

      <div className="flex col-span-5 rounded-xl bg-white mx-[2rem]">
        <MagnifyingGlassIcon className="w-[35px] px-2 text-black" />
        <input
          type="text"
          placeholder="Search for collections and creators"
          className=" col-span-4 p-2 flex-1 rounded-xl"
        />
      </div>

      <div className="flex col-span-1 self-end justify-center items-center HMbtn">
        <UserIcon className="w-[30px] px-1" />
        {address ? (
          <button className="text-[15px]" onClick={disconnect}>
            Hi, {address.slice(0, 4) + "..." + address.slice(-4)}
          </button>
        ) : (
          <p className=" col-span-2 text-center text-[14px]">Connect Wallet</p>
        )}
      </div>
    </div>
  );
};

export default Header;
