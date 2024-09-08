import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
// INTERNAL IMPORT
import { IoMdClose } from "./ReactICON";
import { LOAD_TOKEN_ICO } from "../Context/constants";
import { BUY_TOKEN } from "../Context/index";

const ICOSale = ({ setLoader }) => {
  const { address } = useAccount();
  const [tokenDetails, setTokenDetails] = useState();
  const [price, setPrice] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // Countdown in seconds
  const [currentPrice, setCurrentPrice] = useState(0);

  // Fixed ICO start date (e.g., ICO started on September 1, 2024)
  const ICO_START_DATE = new Date("2024-09-01T00:00:00Z").getTime(); // Use a fixed start date

  useEffect(() => {
    if (address) {
      const loadToken = async () => {
        const token = await LOAD_TOKEN_ICO();
        setTokenDetails(token);
        setCurrentPrice(token?.tokenPrice);
      };
      loadToken();
    }
  }, [address]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const secondsSinceStart = Math.floor((now - ICO_START_DATE) / 1000);

      // 7 days in seconds
      const cycleDuration = 7 * 24 * 60 * 60;

      // Time left in the current cycle
      const timeLeftInCycle = cycleDuration - (secondsSinceStart % cycleDuration);

      setTimeLeft(timeLeftInCycle);
    };

    calculateTimeLeft(); // Initial calculation

    // Timer to update countdown every second
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          // If time left reaches 0, increase price and reset the countdown
          setCurrentPrice((prevPrice) => prevPrice * 1.05); // Increase price by 5%
          calculateTimeLeft(); // Recalculate time left
          return 7 * 24 * 60 * 60; // Reset to 7 days
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const CALLING_FUNCTION_BUY_TOKEN = async (price) => {
    setLoader(true);
    const quantity = price / currentPrice;
    const receipt = await BUY_TOKEN(quantity);
    if (receipt) {
      setLoader(false);
      window.location.reload(); // Reload after purchase (if required)
    }
    setLoader(false);
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
