import React from "react";
import Header from "../components/header";

type Props = {};

const launchpad = (props: Props) => {
  return (
    <div className="launchpad-body">
      <Header />
      <div className="launchpad">
        <form action="">
          <h1>Something Form</h1>
          <div className="nftname">
            <label htmlFor="">Name of NFT Collection</label> <br />
            <input type="text" placeholder="Name of NFT Collection" required />
          </div>
          <div className="nftdesc">
            <label htmlFor="">Description</label> <br />
            <textarea
              name=""
              id=""
              placeholder="Description of NFT"
              required
            ></textarea>
          </div>
          <div className="address">
            <label htmlFor="">NFT Address</label> <br />
            <input type="text" placeholder="NFT Address" required />
          </div>
          {/* <div className="nftslug">
            <label htmlFor="">Slug</label> <br />
            <div className="nftslug1">
              <input type="text" placeholder="NFT Slug" required />
              <button>Generate</button>
            </div>
          </div> */}
          <div className="nftmainimage">
            <label htmlFor="">Main Image</label> <br />
            <input type="file" value="" />
          </div>
          <div className="nftprevimage">
            <label htmlFor="">Preview Image</label> <br />
            <input type="file" value="" />
          </div>
          <div className="nftcreator">
            <label htmlFor="">Creator</label> <br />
            <input type="text" placeholder="Creator Name" required />
          </div>
          <div className="nftcreatoraddr">
            <label htmlFor="">Creator Address</label> <br />
            <textarea name="" placeholder="Creator Address" required></textarea>
          </div>
          <div className="nftcreatoremail">
            <label htmlFor="">Creator Email Address</label> <br />
            <input type="email" placeholder="example@gmail.com" required />
          </div>
          <div className="nftcreatortwitter">
            <label htmlFor="">Creator Twitter Handle</label> <br />
            <input type="text" placeholder="@twitterhandle" />
          </div>
          {/* <div className="nftcreatorslug">
            <label htmlFor="">Creator Slug</label> <br />
            <input type="text" placeholder="Creator Slug" required />
          </div> */}
          <div className="nftcreatorimg">
            <label htmlFor="">Creator Image</label> <br />
            <input type="file" value="" />
          </div>
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default launchpad;
