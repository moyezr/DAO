import { useState } from "react";
import { formatEther } from "ethers/lib/utils";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import homeImg from "../public/0.svg";
import { useDAOContext } from "../context";
const Home = () => {
  const { loading, treasuryBalance, nftBalance, numProposals, createProposal, withdrawDAOEther, isOwner } = useDAOContext();

  const [openCreateProposal, setOpenCreateProposal] = useState(false);
  const [fakeNFTId, setFakeNFTId] = useState("");

  const openCreateProposalHandler = () => {
    setOpenCreateProposal((prev) => !prev);
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.left}>
        <h1 className={styles.heading}>Welcome to DeDevs DAO!</h1>

        <div className={styles.statsContainer}>
          <p className={styles.stats}>Treasury Balance : {formatEther(treasuryBalance)} Ether</p>
          <p className={styles.stats}>Your Ai Mints NFT Balance : {nftBalance}</p>
          <p className={styles.stats}>Total Number of Proposals : {numProposals}</p>
          <p className={styles.contribution}>You can contribute to DAO's Treasury by transfering ETH to below address
          <span>0xccc464BA1B77C844e9CC1e6676d5a5299cF27DA4</span></p>
        </div>

        <div className={styles.btnContainer}>
          <button
            onClick={openCreateProposal ? () =>  createProposal(fakeNFTId) : openCreateProposalHandler}
            className={styles.homeBtn}
          >
            Create Proposal
          </button>
          <Link href="/proposals" className={styles.homeBtn}><button className={styles.homeBtn}>View Proposal</button></Link>
          {isOwner && <button className={styles.homeBtn} onClick={withdrawDAOEther}>Withdraw Funds</button>}
        </div>
        {openCreateProposal ? (
          <div className={styles.createProposalContainer}>
            {loading ? (
              <p>Loading... Creating Proposal</p>
            ) : (
              <>
                <div className={styles.closeBtnContainer}>
                  <span onClick={openCreateProposalHandler}>X</span>
                </div>
                <div>
                  <label htmlFor="fakeIdInput">
                    Fake NFT TokenId To Purchase :{" "}
                  </label>
                  <input
                    type="number"
                    aria-controls="false"
                    className={styles.input}
                    value={fakeNFTId}
                    onChange={(e) => setFakeNFTId(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
      <div className={styles.right}>
        <Image
          className={styles.homeImg}
          src={homeImg}
          width={500}
          height={500}
          alt="Home Image"
        />
      </div>
    </div>
  );
};

export default Home;
