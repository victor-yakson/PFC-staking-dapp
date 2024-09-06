import React, { useState } from "react";

//INTERNAL IMPORT
import { IoMdClose } from "../ReactICON";

const UpdateModel = ({ poolDetails, setLoader, modifyPool, modifyPoolID }) => {
  const [amount, setAmount] = useState();

  const CALLING_FUNCTION_MODIFY_POOL = async (modifyPoolID, amount) => {
    setLoader(true);
    const receipt = await modifyPool(modifyPoolID, amount);
    if (receipt) {
      console.log(receipt);
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
            <h4 className="modal__title">Invest</h4>
            <p className="modal__text">
              Update staking pool #00-{modifyPoolID} AYP %.
            </p>
            <div className="modal__form">
              <label htmlFor="amount2" className="form__label">
                Enter amount
              </label>
              <input
                id="amount2"
                type="text"
                name="amount2"
                className="apool__input"
                style={{
                  backgroundColor: "transparent",
                }}
                placeholder={`amount in %`}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                onClick={() =>
                  CALLING_FUNCTION_MODIFY_POOL(modifyPoolID, amount)
                }
                className="form__btn"
                type="button"
              >
                Update AYP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModel;
