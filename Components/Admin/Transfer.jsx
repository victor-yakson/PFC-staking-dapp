import React, { useState } from "react";

//INTERNAL IMPORT
import ButtonCmp from "./RegularComp/ButtonCmp";
import InputField from "./RegularComp/InputField";
import ClickButton from "./RegularComp/ClickButton";
import Title from "./RegularComp/Title";

const Transfer = ({ poolDetails, transferToken, address, setLoader }) => {
  const [amount, setAmount] = useState();
  const [transferAddress, setTransferAddress] = useState();

  const CALLING_FUNCTION = async (amount, transferAddress) => {
    setLoader(true);

    const receipt = await transferToken(amount, transferAddress);
    if (receipt) {
      console.log(receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };
  return (
    <div className="tab-pane fade" id="tab-4" role="tabpanel">
      <div className="row">
        <div className="col-12">
          <div className="profile">
            <div className="row">
              <Title title={"Transfer"} />

              <InputField
                size={"6"}
                type={"text"}
                title={"Available Supply"}
                name={"method1"}
                disabled={true}
                value={`${poolDetails?.contractTokenBalance
                  .toString()
                  .slice(0, 8)} 
            ${poolDetails?.depositToken.symbol}`}
              />

              <InputField
                size={"6"}
                type={"text"}
                title={"Quentity"}
                name={"amount4"}
                placeholder="amount"
                handleChange={(e) => setAmount(e.target.value)}
              />

              <InputField
                size={"12"}
                type={"text"}
                title={"Contract / Wallet address"}
                name={"wallet0"}
                placeholder="address"
                handleChange={(e) => setTransferAddress(e.target.value)}
              />
              <ClickButton
                name={` Transfer ${poolDetails?.depositToken.symbol}`}
                handleClick={() => CALLING_FUNCTION(amount, transferAddress)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
