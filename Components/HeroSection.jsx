import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;

import { LOAD_TOKEN_ICO } from "../Context/constants";
import { TiTick } from "./ReactICON/index";

const HeroSection = ({ poolDetails, addTokenToMetaMask }) => {
  const { address } = useAccount();
  const [percentage, setPercentage] = useState();
  const [tokenDetails, setTokenDetails] = useState();

  useEffect(() => {
    if (address) {
      const loadToken = async () => {
        const token = await LOAD_TOKEN_ICO();
        setTokenDetails(token);
      };
      loadToken();
    }
  }, [address]);

  useEffect(() => {
    const calculatePercentage = () => {
      const tokenSold = tokenDetails?.soldTokens ?? 0;
      const tokenTotalSupply =
        tokenDetails?.soldTokens + Number(tokenDetails?.tokenBal) * 1 ?? 1;

      const percentageNew = (tokenSold / tokenTotalSupply) * 100;

      if (tokenTotalSupply === 0) {
        console.error(
          "Token sale balance is zero, cannot calculate percentage."
        );
      } else {
        setPercentage(percentageNew);
      }
    };

    const timer = setTimeout(calculatePercentage, 1000);

    return () => clearTimeout(timer);
  }, [tokenDetails]);

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-7 col-xl-6">
            <div className="hero__content hero__content--first">
              <h1 className="hero__title">
                <strong>PolyFarm Coin</strong> <br />
                In the De-Fi Space, Every Degen needs PFC to win big.
              </h1>
              <div className="hero__btns">
                <a
                  data-bs-target="#modal-deposit1"
                  type="button"
                  data-bs-toggle="modal"
                  className="hero__btn"
                >
                  BUY {tokenDetails?.symbol  || "" } Presale
                </a>
                <a
                  onClick={() => addTokenToMetaMask()}
                  className="hero__btn hero__btn--light"
                >
                  Add Token {tokenDetails?.symbol || ""}
                </a>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-5 col-xl-4 offset-xl-2">
            <div className="hero__content hero__content--second">
              <div className="node node--hero">
                <h3 className="node__title node__title--red">
                  <b>{tokenDetails?.symbol || ""}</b> Token Pre-Sale
                </h3>
                <span className="node__date">
                  {tokenDetails?.tokenPrice || ""} {CURRENCY} Per PFC
                </span>
                <span className="node__price">
                  Pre-Sale Left:{" "}
                  <b>
                    {tokenDetails?.tokenBal || ""} {tokenDetails?.symbol || ""}
                  </b>
                </span>
                <span className="node__line">
                  <img src="img/dodgers/dots--line-red.svg" alt="" />
                </span>
                <ul className="node__list">
                  <li>
                    <i className="ti ">
                      <TiTick />
                    </i>
                    <b>20%</b> Presale Allocation
                  </li>
                  <li>
                    <i className="ti ">
                      <TiTick />
                    </i>
                    <b>30%</b> Staking Alloc.
                  </li>
                  <li>
                    <i className="ti ">
                      <TiTick />
                    </i>
                    <b>10%</b> Liquidity Alloc.
                  </li>
                  <li>
                    <i className="ti ">
                      <TiTick />
                    </i>
                    <b>20%</b> Marketing Alloc.
                  </li>
                  <li>
                    <i className="ti ">
                      <TiTick />
                    </i>
                    <b>10%</b> Project Finance Alloc.
                  </li>
                  <li>
                    <i className="ti ">
                      <TiTick />
                    </i>
                    <b>10%</b> Charity & Partnership Alloc.
                  </li>
                  <li>
                    <i className="ti ">
                      <TiTick />
                    </i>
                    <b>
                      {tokenDetails?.supply || ""} {tokenDetails?.symbol || ""}
                    </b>{" "}
                    Total Supply
                  </li>
                </ul>

                <div className="progressbar progressbar--cta">
                  <h3 className="progressbar__title">
                    Tokens Bought: {tokenDetails?.soldTokens || ""}{" "}
                    {tokenDetails?.symbol || ""}
                  </h3>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label="Animated striped"
                    aria-valuenow={75}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      style={{ width: `${percentage || ""}%` }}
                    >
                      <span>{tokenDetails?.soldTokens || ""}</span>
                    </div>
                  </div>
                  <div className="progressbar__values">
                    <span className="progressbar__value progressbar__value--left"></span>
                    <span className="progressbar__value progressbar__value--right">
                      {Number(tokenDetails?.tokenBal || 0) +
                        Number(tokenDetails?.soldTokens || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
