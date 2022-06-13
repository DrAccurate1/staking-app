import {
  ThirdwebNftMedia,
  useAddress,
  useMetamask,
  useNFTDrop,
  useToken,
  useTokenBalance,
  useOwnedNFTs,
  useContract,
} from "@thirdweb-dev/react";
import { count } from "console";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { redirect } from "next/dist/server/api-utils";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { MetaMaskInpageProvider } from '@metamask/providers';
import { isNumberObject } from "util/types";

const nftDropContractAddress = "0x1305067cf45743aed22708ae1eb8add52e4878f4";
const tokenContractAddress = "0x5C7aaBF6d062014AA44DC665ebeC1487b94BC6D5";
const stakingContractAddress = "0x770286741fA1550696bC5090CcBe8fC11f3b0B30";
//@ts-ignore: Object is possibly 'undefined'

const Stake: NextPage = () => {
  // Wallet Connection Hooks
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const minaddress = useAddress()?.substring(0, 6);
  const lasthree = address?.slice(-4);

  const addresos = minaddress + '...' + lasthree;
  // Contract Hooks
  const nftDropContract = useNFTDrop(nftDropContractAddress);
  const tokenContract = useToken(tokenContractAddress);

  const { contract, isLoading } = useContract(stakingContractAddress);

  // Load Unstaked NFTs
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);

  // Load Balance of Token
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  


  ///////////////////////////////////////////////////////////////////////////
  // Custom contract functions
  ///////////////////////////////////////////////////////////////////////////
  const [stakedNfts, setStakedNfts] = useState<any[]>([]);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

  const tokenAddress = '0x5C7aaBF6d062014AA44DC665ebeC1487b94BC6D5';
  const tokenSymbol = '$BDC';
  const tokenDecimals = 18;
  const tokenImage = 'https://billionaireducks.club/images/token.png';

  async function addTokenFunction() {

    try {
      const ethereum = window.ethereum as MetaMaskInpageProvider;
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log('Billionaire Ducks Club ($BDC) Token has been added to your metamask successfully.');
      } else {
        console.log('Billionaire Ducks Club ($BDC) Token has not been added');
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (!contract) return;

    async function loadStakedNfts() {
      const stakedTokens = await contract?.call("getStakedTokens", address);

      // For each staked token, fetch it from the sdk
      const stakedNfts = await Promise.all(
        stakedTokens?.map(
          async (stakedToken: { staker: string; tokenId: BigNumber }) => {
            const nft = await nftDropContract?.get(stakedToken.tokenId);
            return nft;

          }

        )

      );

      setStakedNfts(stakedNfts);
      console.log("setStakedNfts", stakedNfts);
      const stkdnft = setStakedNfts.length;
    }

    if (address) {
      loadStakedNfts();
    }
  }, [address, contract, nftDropContract]);

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const cr = await contract?.call("availableRewards", address);
      console.log("Loaded claimable rewards", cr);
      setClaimableRewards(cr);
    }

    loadClaimableRewards();
  }, [address, contract]);

  ///////////////////////////////////////////////////////////////////////////
  // Write Functions
  ///////////////////////////////////////////////////////////////////////////
  async function stakeNft(id: BigNumber) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    // If not approved, request approval
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    const stake = await contract?.call("stake", id);
  }

  async function withdraw(id: BigNumber) {
    const withdraw = await contract?.call("withdraw", id);
  }


  function refresh() {
    location.reload();
  }

  async function claimRewards() {
    const claim = await contract?.call("claimRewards");
  }

  if (isLoading) {
    return <div><br></br><br></br><br></br>Loading</div>;
  }
  var stkdnft = stakedNfts.length;
  var nftsum = Number(ownedNfts?.length);
  // const stkdnft = stakedNfts.length;
  // const nftsum = ownedNfts?.length;
  const estimated = stkdnft * 0.01;
  const estimatedday = stkdnft * 0.01 * 24;
  const total = nftsum + stkdnft;

  return (


    <div className={styles.container}>



      {!address ? (
        <div className={styles.parent}>
          <div className={styles.child}>
            <button className={styles.mainButton} onClick={connectWithMetamask}>
              Connect Wallet
            </button>
          </div></div>
      ) : (
        <>
          {/* <div className={styles.cardse}>
            
<div className={styles.cardee}></div>
          <div className={styles.cardee}>
          <h2>Your Tokens</h2>

          <div className={styles.tokenGrid}>
            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
              <p className={styles.tokenValue}>
                <b>
                  {!claimableRewards
                    ? "Loading..."
                    : ethers.utils.formatUnits(claimableRewards, 18)}
                </b>{" "}
                {tokenBalance?.symbol}
              </p>
            </div>
            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>Current Balance</h3>
              <p className={styles.tokenValue}>
                <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
              </p>
            </div>
          </div>

          <button
            className={`${styles.mainButton} ${styles.spacerTop}`}
            onClick={() => claimRewards()}
          >
            Claim Rewards
          </button>
</div>
</div> */}
<title>Billionaire Ducks Club - Staking</title>
          <nav>
            <input type="checkbox" id="menu-check" />
            <label htmlFor="menu-check">
              <span className={styles.menuopen} id="menu-open">Menu</span>
              <span className={styles.menuclose} id="menu-close">Close</span>
            </label>
            <a className={styles.logoo} href="#">.</a>
            <ul>
              <li><a href="https://billionaireducks.club">Home</a></li>
              <li><a href="https://opensea.io/collection/official-billionaire-ducks-club">Opensea</a></li>
              <li><a href="https://polygonscan.com/token/0x1305067cf45743aed22708ae1eb8add52e4878f4">Polygon</a></li>
              <li><a href="https://discord.gg/VzgjuBDdkx">Discord</a></li>
              <li><a href="https://twitter.com/billionduckclub">Twitter</a></li>
            </ul>
          </nav>
          <div className={styles.cardsee}>

            <div className={styles.cardeza}>
              <h1>Billionaire Ducks Club</h1>
              <br></br>

              <br></br><p>As of now, phase 2 officialy started our beloved ducks is still looking for homes. our coin will be used for the future marketplace and in-game assets.<br></br> the more you let your ducks on the loose the more it`ll be beneficial for you and for the future of this project
                <br></br> <br></br>-Duck Mafia Team
              </p>
            </div>
            <div className={styles.cardee}>
              
              <div className={styles.pcard}>
                {/* <div className={styles.img}>
        <img src="https://4.bp.blogspot.com/-qxWysu0KsQ0/YX5y4e6uGLI/AAAAAAAACAA/Pvlz1Gigp_EixyPExFI5sm8Srr3jBuUmgCK4BGAYYCw/s113-pf/jane-doe-img%25252B%252525281%25252529.jpg"/>
      </div> */}
                <div className={styles.infos}>
                  {/* <div className={styles.name}>
          <h2>Profile</h2>
          <p>Connected Wallet: {addresos}</p>
        </div> */}
                  {/* <p className={styles.text}>
          Connected Wallet: {addresos}
        </p> */}
                  {<ul className={styles.stats}>
                    <li>
                      <h1>{total}</h1>
                      <p>Total</p>
                    </li>
                    <li>
                      <h1>{nftsum}</h1>
                      <p>Unstaked</p>
                    </li>
                    <li>
                      <h1>{stkdnft}</h1>
                      <p>Staked</p>
                    </li>
                  </ul>}
                  <br></br><br></br>

                  <div className={styles.linkse}>
                    <b>Total Balance</b><br></br>
                    <button className={styles.viewz}>
                      {tokenBalance?.displayValue} {tokenBalance?.symbol}</button><br></br><br></br>
                    <b >Available to Claim</b> <br></br>
                    <button className={styles.followzgreen}>


                      {!claimableRewards
                        ? "Loading..."
                        : parseFloat(ethers.utils.formatUnits(claimableRewards, 18)).toFixed(6)}{"~ "}
                      {tokenBalance?.symbol}
                    </button>
                    <p>( {estimated}~ $BDC/hour )</p>
                    <p>( {estimatedday}~  $BDC / day )</p>
                  </div>


                  <br></br>
                  <button id="MyButton" className={styles.mainButtone}  onClick={() => refresh()}>⟲ Refresh</button><br></br><br></br>
                  <button
                    className={`${styles.mainButton} ${styles.spacerTop}`}
                    onClick={() => claimRewards()}
                  >
                    Claim Rewards
                  </button><br></br><br></br>
                </div>
              </div>
            </div>
            <div className={styles.cardee}><div className={styles.pcard}>
                <p className={styles.text}>
                  Connected Wallet: {addresos}
                </p></div><br></br>
              <div className={styles.pcard}>
                <div className={styles.infos}>
                <br></br>
                  <h1>
                    Contract Details
                  </h1><br></br>
                  <h3>NFT Contract Address</h3><br></br>
                  <input type="text" className={styles.stameshe} value="0x1305067cf45743aed22708ae1eb8add52e4878f4" id="myInput"></input><br></br><br></br>
                  <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    onClick={() => window.open('https://polygonscan.com/token/0x1305067cf45743aed22708ae1eb8add52e4878f4')}
                  >
                    View Transactions
                  </button><br></br><br></br>
                  <h3>$BDC Token Contract Address</h3><br></br>
                  <input type="text" className={styles.stameshe} value="0x5C7aaBF6d062014AA44DC665ebeC1487b94BC6D5" id="myInput"></input><br></br><br></br>
                  <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    onClick={() => addTokenFunction()}
                  >
                    Add Token to Metamask
                  </button>
                </div></div>
            </div></div>

          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <br></br>

          <div className={styles.cardse}>

            <h1>UNSTAKED</h1>
            <h1 className={styles.desktop}>STAKED</h1>
            <div className={styles.carde}>
              <div className={styles.cards}>

                {ownedNfts?.map((nft) => (
                  <div className={styles.card} key={nft.metadata.id.toString()}>
                    <ThirdwebNftMedia
                      metadata={nft.metadata}
                      className={styles.nftMedia}
                    />
                    {<div className={styles.topleft}>#{nft.metadata.id.toString()}</div>}
                    <button
                      className={`${styles.mainButton}`}
                      onClick={() => stakeNft(nft.metadata.id)}
                    >
                      Stake
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <h1 className={styles.mobile}>STAKED</h1>
            <div className={styles.carde}>
              {/* <div className={styles.nftBoxGrid}> */}
              <div className={styles.cards}>
                {stakedNfts?.map((nft) => (
                  <div className={styles.card} key={nft.metadata.id.toString()}>
                    <ThirdwebNftMedia
                      metadata={nft.metadata}
                      className={styles.nftMedia}
                    />
                    {<div className={styles.topleft}>#{nft.metadata.id.toString()}</div>}
                    <button
                      className={`${styles.mainButton}`}
                      onClick={() => withdraw(nft.metadata.id)}
                    >
                      Unstake
                    </button>
                  </div>
                ))}
              </div>
            </div>



          </div>
        </>
      )}

    </div>
  );
};

export default Stake;
