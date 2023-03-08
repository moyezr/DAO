import styles from "../styles/Proposal.module.css"
import { Card } from "../components"
import { useDAOContext } from "../context"
import { useEffect } from "react"
const Proposal = () => {

  const {proposals, fetchAllProposals} = useDAOContext();
  useEffect (() => {
    fetchAllProposals();
    console.log("Proposals", proposals)
  }, [])

  const demoProposals = [{
    proposalId: 1,
    nftTokenId: 1,
    deadline: "16 January 2",
    yayVotes: 1,
    nayVotes: 2,
    executed: "false",
  },
  {
    proposalId: 2,
    nftTokenId: 3,
    deadline: "15 January 2",
    yayVotes: 2,
    nayVotes: 1,
    executed: "true",
  },
  {
    proposalId: 3,
    nftTokenId: 5,
    deadline: "11 January 2",
    yayVotes: 0,
    nayVotes: 2,
    executed: "false",
  }]

  return (
    <div className={styles.proposal}>
      <h1 className={styles.heading}>Welcome to DeDevs DAO!</h1>
      <h2>Proposals</h2>
      <div className={styles.proposalsContainer}>
        { proposals ? (
          proposals.map((prop, index) => {
            return <Card key={`${index + 1}`} proposalId={prop.proposalId}
              nftTokenId={prop.nftTokenId}
              deadline={prop.deadline}
              yayVotes={prop.yayVotes}
              nayVotes={prop.nayVotes}
              executed={prop.executed}
             />
          })
          ) : null
        }
      </div>
    </div>
  )
}

export default Proposal