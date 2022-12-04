import { useAddress, useContract } from "@thirdweb-dev/react";
import { VoteType } from "@thirdweb-dev/sdk";
import styles from "../../styles/ProposalCard.module.css";
import { ethers } from "ethers";
import React, { useMemo, useState } from "react";

type Props = {
  proposalId: any;
  state: any;
  votes: any;
  proposer: string;
  description: string;
};

const Proposal = (proposal: Props) => {
  const address = useAddress();

  const { contract, isLoading, error } = useContract(
    "0xa029696a33f655815422AE34ceFE0C1c6C9C1E39",
    "vote"
  );
  const { contract: token } = useContract(
    "0x62be077ab48C147122d3C3e54388aEA88F9d7815",
    "token"
  );

  const isExecutable = async (id: any) => {
    const canExecute = await contract?.canExecute(id);
    return canExecute;
  };

  const checkIfVoted = async (id: any) => {
    const res = await contract?.hasVoted(id, address);
    console.log(res, "hasVoted");
    return res;
  };
  const executeProposal = async (id: any) => {
    const canExecute = await isExecutable(id);
    if (canExecute) {
      const res = await contract?.execute(id);
      console.log(res);
    } else {
      console.log("Can not execute");
    }
  };

  const voteFor = async (id: any, type: any, reason: any) => {
    if (!token) return;
    if (!contract) return;
    let addy: any = address;
    try {
      const delegation = await token.getDelegationOf(addy);
      if (delegation === ethers.constants.AddressZero) {
        await token.delegateTo(addy);
      }
      let voteType;
      if (type === "Against") {
        voteType = VoteType.Against;
      } else if (type === "For") {
        voteType = VoteType.For;
      } else {
        voteType = VoteType.Abstain;
      }
      const res = await checkIfVoted(id);
      if (!res) {
        await contract.vote(id, voteType, reason);
      } else {
        console.log("You have already voted for this proposal");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const { address, voteFor, executeProposal } = useContext(ApeDaoContext);
  const [statusText, setStatusText] = useState("");
  const [statusColor, setStatusColor] = useState("#fff");
  const setStatus = () => {
    switch (proposal.state) {
      case 0:
        setStatusText("Pending");
        setStatusColor("#48494a");
      case 1:
        setStatusText("Active");
        setStatusColor("#21b66f");
        break;
      case 3:
        setStatusText("Defeated");
        setStatusColor("#f44336");
        break;
      case 7:
        setStatusText("Executed");
        setStatusColor("#0011ff");
        break;
      case 4:
        setStatusText("Successful");
        setStatusColor("#21b66f");
        break;
      default:
        setStatusText("Unknown");
        setStatusColor("#fff");
    }
  };

  useMemo(() => {
    setStatus();
  }, [statusText, statusColor, proposal.state]);
  return (
    <div
      className={`${styles.card} bg-[#00001f] py-[2rem] rounded lg:p-[1.4rem] lg:w-[30rem] px-[2rem] lg:rounded-[10px]`}
    >
      <div className="flex justify-between">
        <div>
          <div className="lg:text-[1rem] font-semibold text-white">
            Proposer:{" "}
            {proposal?.proposer?.slice(0, 4) +
              "..." +
              proposal?.proposer?.slice(-4)}
          </div>

          <div className={styles.description}>{proposal.description}</div>
        </div>
        <div className={styles.status} style={{ backgroundColor: statusColor }}>
          {statusText}
        </div>
      </div>
      {proposal?.votes?.map((vote: any) => {
        return (
          <div key={Math.random()}>
            <button
              className={`${styles.voteButton} font-Cinzel`}
              key={Math.random()}
              onClick={() => {
                voteFor(proposal.proposalId, vote.label, "");
              }}
            >
              {vote.label}
            </button>
          </div>
        );
      })}
      <div className={styles.bottom}>
        <div className={styles.results}>
          {proposal?.votes?.map((vote: any) => {
            const voteCount: any = ethers.utils.formatEther(vote.count);

            return (
              <div key={Math.random()}>
                <div className="text-[13px] font-Cinzel font-semibold">
                  {vote.label}: {Math.trunc(voteCount)} Happy Coins
                </div>
              </div>
            );
          })}
        </div>
        {proposal.state === 4 && (
          <button
            className={styles.executeButton}
            onClick={() => {
              executeProposal(proposal.proposalId);
            }}
          >
            Execute
          </button>
        )}
      </div>
    </div>
  );
};

export default Proposal;
