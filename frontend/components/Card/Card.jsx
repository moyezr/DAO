import styles from "./Card.module.css"

import { useDAOContext } from "../../context"

const Card = ({proposalId,nftTokenId, yayVotes, nayVotes, deadline, executed, loading }) => {
  
    const { voteOnProposal, executeProposal } = useDAOContext(); 
  return (
    <div className={styles.card}>
    <div>
        <p className={styles.stats}>Proposal Id: {proposalId}</p>
        <p className={styles.stats}>Fake NFT to Purchase: {nftTokenId}</p>
      
        <p className={styles.stats}>Deadline: {deadline.toLocaleString()}</p>
        <p className={styles.stats}>Yay Votes: {yayVotes}</p>
        <p className={styles.stats}>Nay Votes: {nayVotes}</p>
        <p className={styles.stats}>Executed?: {executed.toString().toUpperCase()}</p>
    </div>
    {
      loading ? (
        <div className={styles.statusContainer}>
          <p className={styles.statusMsg}>Loading...Please Wait</p>
        </div>
      ) : (
        <div className={styles.statusContainer}>
      {executed.toString() == "true" ? (
        <p className={styles.statusMsg}>Proposal Executed!</p>
      ) : deadline.getTime() > Date.now() ? <>
        <button onClick={() => voteOnProposal(proposalId, "YAY")} className={styles.voteBtn}>Vote Yay</button>
        <button onClick={() => voteOnProposal(proposalId, "NAY")} className={styles.voteBtn}>Vote Nay</button>
      </> : <button className={styles.executeBtn} onClick={() => executeProposal(proposalId)}> Execute Proposal </button> }
    </div>
      )
    }
    
    </div>
  )
}

export default Card