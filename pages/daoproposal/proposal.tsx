import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { useAddress, useContract } from "@thirdweb-dev/react";
import Header from "../components/header";
import Proposals from "../components/proposal";
import Login from "../components/login";
type Props = {};

const Proposal = (props: Props) => {
  const address = useAddress();
  const [proposalInput, setProposalInput] = useState("");
  const [proposals, setProposals] = useState<any>(null);
  const { contract, isLoading, error } = useContract<any>(
    "0xaED1db2F23de8E434D95fd76342039F8D0D04C73",
    "vote"
  );
  const { contract: token } = useContract(
    "0x31815E59997Db4767d4a90D4d7Fb1CA5586f4b4B",
    "token"
  );

  console.log(contract);

  // get list of all proposals
  const getAllProposal = async () => {
    if (!contract) return;
    const proposalss = await contract.getAll();
    setProposals(proposalss);
    console.log(proposalss, "NOT HERE");
  };

  // create a proposal
  const createProposal = async (description: any) => {
    const amount = 100_000;
    const executions = [
      {
        toAddress: token?.getAddress(),
        nativeTokenValue: 0,
        transactionData: token?.encoder.encode("transfer", [
          contract?.getAddress(),
          amount,
        ]),
      },
    ];
    const proposal = await contract?.propose(description, executions);
    console.log(proposal);
  };

  useEffect(() => {
    getAllProposal();
  }, [contract]);
  return (
    <div className={styles.wrapper}>
      {address ? (
        <>
          <Header />
          {proposals ? (
            <div
              className={`${styles.content} pt-[7rem] lg:flex justify-between`}
            >
              {address === "0x988d9c9c025168b4Ace2462D102fAa4A60154Dc2" ? (
                <div
                  className={`${styles.createProposalForm} bg-[#00001f] rounded font-Cinzel`}
                >
                  <div className={`${styles.formTitle} `}>
                    Make a Proposal Now
                  </div>
                  <input
                    className={styles.formInput}
                    placeholder="Make a Proposal"
                    value={proposalInput}
                    onChange={(e) => {
                      setProposalInput(e.target.value);
                    }}
                  />
                  <button
                    className={styles.formButton}
                    disabled={!proposalInput}
                    onClick={() => {
                      createProposal(proposalInput);
                      setProposalInput("");
                    }}
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <>
                  <p>You are not an admin</p>
                </>
              )}

              <div className={styles.proposals}>
                {proposals &&
                  proposals.map((proposal: any, i: any) => {
                    return (
                      <Proposals
                        key={i}
                        proposalId={proposal.proposalId}
                        state={proposal.state}
                        votes={proposal.votes}
                        proposer={proposal.proposer}
                        description={proposal.description}
                      />
                    );
                  })}
              </div>
            </div>
          ) : (
            <p className="text-center text-2xl font-Alkalami animate-pulse text-blue-600 pt-[10rem]">
              Loading Proposals...
            </p>
          )}
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Proposal;
