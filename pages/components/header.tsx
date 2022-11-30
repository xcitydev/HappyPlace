import Link from "next/link";
import React from "react";

type Props = {};

const Header = (props: Props) => {
  return (
    <div>
      <Link href="/list">
        <p>My WALLET</p>
      </Link>
    </div>
  );
};

export default Header;
