import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
// INTERNAL IMPORT
import { IoMdClose } from "./ReactICON";
import { LOAD_TOKEN_ICO } from "../Context/constants";
import { BUY_TOKEN } from "../Context/index";

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

const ICOSale = ({ setLoader }) => {
  const { address } = useAccount();
  const [tokenDetails, setTokenDetails] = useState();
  const [price, setPrice] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7 * 24 * 60 * 60); // 7 days in seconds
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    if (address) {
      const loadToken = async () => {
        const token = await LOAD_TOKEN_ICO();
        setTokenDetails(token);
        setCurrentPrice(token?.tokenPrice);
        console.log(token);
      };
      loadToken();
    }
  }, [address]);

  useEffect(() => {
    // Check if there's a saved time in local storage
    const savedTime = localStorage.getItem("tokenSaleTimeLeft");
    const savedTimestamp = localStorage.getItem("tokenSaleSavedTimestamp");

    if (savedTime && savedTimestamp) {
      const elapsedTime = Math.floor((Date.now() - savedTimestamp) / 1000);
      const remainingTime = savedTime - elapsedTime;
      setTimeLeft(remainingTime > 0 ? remainingTime : 7 * 24 * 60 * 60);
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          setCurrentPrice((prevPrice) => prevPrice * 1.05); // Increase price by 5%
          localStorage.setItem("tokenSaleTimeLeft", 7 * 24 * 60 * 60); // Reset timer
          localStorage.setItem("tokenSaleSavedTimestamp", Date.now());
          return 7 * 24 * 60 * 60;
        }
        // Save the time left and timestamp in local storage
        localStorage.setItem("tokenSaleTimeLeft", prevTime - 1);
        localStorage.setItem("tokenSaleSavedTimestamp", Date.now());
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const CALLING_FUNCTION_BUY_TOKEN = async (price) => {
    setLoader(true);
    const quentity = price / currentPrice;
    console.log(quentity);
    const receipt = await BUY_TOKEN(quentity);
    if (receipt) {
      console.log(receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(true);
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div
      className="modal modal--auto fade"
      id="modal-deposit1"
      tabIndex={-1}
      aria-labelledby="modal-deposit1"
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
            <h4 className="modal__title colorful-title">
              {tokenDetails?.token.symbol} Pre-Sale - Current Price: {currentPrice} POL
            </h4>
            <p className="modal__text">
              Participate in the <span>Ongoing PolyFarm</span> Token Sale
            </p>

            <div className="modal__form">
              <div className="form__group colorful-supply">
                <label className="form__label">
                  Tokens Sale Left:{" "}
                  {`${tokenDetails?.tokenBal} ${tokenDetails?.token.symbol} `}
                </label>
                <input
                  name="price"
                  type="text"
                  className="form__input"
                  placeholder={`Please Enter POL Amount`}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="form__group">
                <label className="form__label">Receive:</label>
                <input
                  name="amount"
                  type="text"
                  className="form__input"
                  placeholder={`${
                    price / currentPrice
                  } ${tokenDetails?.token.symbol}`}
                  disabled
                />
              </div>
              <div className="form__group">
                <label className="form__label">Until Next 5% Price Increase:</label>
                <input
                  name="countdown"
                  type="text"
                  className="form__input colorful-timer"
                  value={formatTime(timeLeft)}
                  disabled
                />
              </div>
              <button
                className="form__btn"
                type="button"
                onClick={() => CALLING_FUNCTION_BUY_TOKEN(price)}
              >
                Buy {tokenDetails?.token.symbol} Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICOSale;
