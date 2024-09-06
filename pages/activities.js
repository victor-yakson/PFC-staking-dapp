import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

//INTERNAL IMPORT
import {
  Header,
  Footer,
  Statistics,
  Loader,
  Notification,
  ICOSale,
} from "../Components/index";
import {
  CONTRACT_DATA,
  deposit,
  withdraw,
  claimReward,
  addTokenToMetaMask,
} from "../Context/index";

const activity = () => {
  const { address } = useAccount();
  const [loader, setLoader] = useState(false);

  const [poolDetails, setPoolDetails] = useState();

  const LOAD_DATA = async () => {
    if (address) {
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
      <Header page={"activity"} />
      <div className="new-margin"> </div>
      <Statistics poolDetails={poolDetails} />
      <Notification poolDetails={poolDetails} page={"activity"} />

      <Footer />
      <ICOSale setLoader={setLoader} />
      {loader && <Loader />}
    </>
  );
};

export default activity;
