import styles from "./Navbar.module.css"
import Link from "next/link";
import { useRouter } from "next/router";
import { useDAOContext } from "../../context";
const Navbar = () => {

    const router = useRouter();
    const { currentAddress, walletConnected, connectWallet } = useDAOContext();

  return (
    <nav className={styles.navbar}>
        <Link href="/" ><span className={styles.logo}>DeDevs DAO</span></Link>
        <div className={styles.address} onClick={connectWallet}>
         {
          walletConnected ? `Connected To ${currentAddress.slice(0,10)}..${currentAddress.slice(currentAddress.length-11)}` : (
            <p>Please Connect Your Wallet</p>-1
          )
         } 
        </div>
        <Link target='_blank' href="https://ai-nft-minting-horec6ihg-moyezrabbaniwork-gmailcom.vercel.app" className={styles.navbar_link}>Get an AiMints NFT</Link>
    </nav>   
  )
}

export default Navbar