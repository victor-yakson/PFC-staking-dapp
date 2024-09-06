import React, { useState } from "react";

//INTERNAL IMPORT
import { IoMdClose } from "./ReactICON";
import PopUpInputField from "./Admin/RegularComp/PopUpInputField";
import PupUpButton from "./Admin/RegularComp/PupUpButton";
import InputRatio from "./Admin/RegularComp/InputRatio";
import toast from "react-hot-toast";

const PoolsModel = ({
  deposit,
  poolID,
  address,
  selectedPool,
  selectedToken,
  setLoader,
  nativeBalance,
}) => {
  const [amount, setAmount] = useState();

  const CALLING_FUNCTION = async (poolID, amount, address) => {
    setLoader(true);
    const balance = await nativeBalance(address);

    console.log("balance from modal:", balance);

    if (balance < 0.7) {
      toast.error("You don't have enough MATIC to cover for fee", {
        duration: 2000,
      });
      setLoader(false)
      return;
    }
    const receipt = await deposit(poolID, amount, address);
    if (receipt) {
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };
  return (
    <div
      className="modal modal--auto fade"
      id="modal-apool"
      tabIndex={-1}
      aria-labelledby="modal-apool"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal__content">
            <button
              className="modal__close"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i className="ti ti-x">
                <IoMdClose />
              </i>
            </button>
            <h4 className="modal__title">Stake</h4>
            <p className="modal__text">
              You’re early enough to witness a new golden age of{" "}
              {selectedPool?.depositToken.name} token to eran reward .
            </p>
            <div className="modal__form">
              <PopUpInputField
                title={` Stake ${selectedPool?.depositToken.name} token`}
                placeholder={"Amount"}
                handleChange={(e) => setAmount(e.target.value)}
              />

              <div className="form__group">
                <label className="form__label">Pool Details:</label>
                <ul className="form__radio">
                  <InputRatio
                    index={1}
                    value={`Your Deposited: ${selectedToken?.amount}
                      ${selectedPool?.depositToken.symbol}`}
                  />
                  <InputRatio
                    index={2}
                    value={`Total Deposited: ${selectedPool?.depositedAmount}
                      ${selectedPool?.depositToken.symbol}`}
                  />
                  <InputRatio
                    index={3}
                    value={`My Balance:
                      ${selectedToken?.depositToken.balance.slice(0, 8)}
                      ${selectedPool?.depositToken.symbol}`}
                  />
                </ul>
              </div>
              <PupUpButton
                title={"Proceed"}
                handleClick={() => CALLING_FUNCTION(poolID, amount, address)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolsModel;
