import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <br></br><br></br><br></br>
      <h1 className={styles.h1}>Billionaire Ducks Club - NFT Staking Platform</h1>

      <div
        className={styles.nftBoxGrid}
        role="button"
        onClick={() => router.push(`/stake`)}
      >
        {/* Mint a new NFT */}

        <div
          className={styles.optionSelectBox}
          role="button"
        ><br></br>
          <img src={`https://billionaireducks.club/images/token.png`}alt="Token" />
          <h2 className={styles.selectBoxTitle}>Stake your NFTs</h2>
          <p className={styles.selectBoxDescription}>
            Your Staked NFTs will be transferred to our staking contract which means it will not be available to sell or
             transfer on opensea as long as it is <b>staked.</b><br></br><br></br>
              In order to be able to sell or transfer your NFT on opensea, you have to <b>unstake</b> it and
              it'll be transferred back to your wallet.<br></br><br></br>
              <button className={styles.mainButtone}   onClick={() => router.push(`/stake`)}>I Understand</button>
              <br></br><br></br>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
