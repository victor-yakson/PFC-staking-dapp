import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";


//INTERNAL IMPORT
import {
  Header,
  HeroSection,
  Footer,
  Pools,
  PoolsModel,
  WithdrawModal,
  Withdraw,
  Partners,
  Statistics,
  Token,
  Loader,
  Notification,
  ICOSale,
  Contact,
  Ask,
  
} from "../Components/index";
import {
  CONTRACT_DATA,
  deposit,
  withdraw,
  claimReward,
  addTokenToMetaMask,
  getBalance
} from "../Context/index";
import { LOAD_TOKEN_ICO } from "../Context/constants";

const index = () => {
  const { address } = useAccount();
  const [loader, setLoader] = useState(false);
  const [contactUs, setContactUs] = useState(false);
  const [poolID, setPoolID] = useState();
  const [withdrawPoolID, setWithdrawPoolID] = useState();

  const [poolDetails, setPoolDetails] = useState();
  const [selectedPool, setSelectedPool] = useState();
  const [selectedToken, setSelectedToken] = useState();

  const LOAD_DATA = async () => {
    if (address) {
      console.log(address);
      setLoader(true);
      const data = await CONTRACT_DATA(address);
      setPoolDetails(data);

      setLoader(false);
    }
  };

  useEffect(() => {
    LOAD_DATA();
  }, [address]);

  return (
    <>
      <Header />
      <HeroSection
        poolDetails={poolDetails}
        addTokenToMetaMask={addTokenToMetaMask}
      />
      <Statistics poolDetails={poolDetails} />
      <Pools
        setPoolID={setPoolID}
        poolDetails={poolDetails}
        setSelectedPool={setSelectedPool}
        setSelectedToken={setSelectedToken}
      />
      <Token poolDetails={poolDetails} />
      <Withdraw
        setWithdrawPoolID={setWithdrawPoolID}
        poolDetails={poolDetails}
      />

      <Notification poolDetails={poolDetails} />
      <Partners />
      <Ask setContactUs={setContactUs} />
      <Footer />
      <PoolsModel
        deposit={deposit}
        poolID={poolID}
        address={address}
        selectedPool={selectedPool}
        selectedToken={selectedToken}
        setLoader={setLoader}
        nativeBalance={getBalance}
      />
      <WithdrawModal
        withdraw={withdraw}
        withdrawPoolID={withdrawPoolID}
        address={address}
        setLoader={setLoader}
        claimReward={claimReward}
      />
      <ICOSale setLoader={setLoader} />
      {contactUs && <Contact setContactUs={setContactUs} />}

      {loader && <Loader />}
    </>
  );
};

export default index;
