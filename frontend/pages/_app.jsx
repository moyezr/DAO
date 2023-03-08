import "../styles/globals.css";
import { Navbar, Footer } from "../components";
import DAOProvider from "../context";
import Head from "next/head"

function MyApp({ Component, pageProps }) {
  return (
    <DAOProvider>
          <Head>
        <title>DeDevs DAO</title>
        <meta name="description" content="DeDevs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Navbar />
        <Component {...pageProps} />
        <Footer/>
    </DAOProvider>
  );
}

export default MyApp;
