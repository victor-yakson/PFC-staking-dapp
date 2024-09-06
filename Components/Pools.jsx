import React from "react";

import { MdOutlineAttachMoney, FaRegCopy } from "./ReactICON/index";

const Pools = ({
  setPoolID,
  poolDetails,
  setSelectedPool,
  setSelectedToken,
}) => {
  const poolArray = poolDetails?.poolInfoArray ?? [];

  return (
    <div id="staking" className="section">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
            <div className="section__title">
              <h2>Staking pools</h2>
              <p>
              You're early to the party! Buy and Stake now during Presale to max out your rewards before the price skyrockets!
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          {poolArray
            .map((pool, index) => (
              <div
                className={`col-12 ${
                  index === 0 || index === 1
                    ? "col-md-6"
                    : index === 2
                    ? ""
                    : ""
                } col-lg-4`}
              >
                <div className="apool">
                  <h3 className="apool__title">
                    {index == 0
                      ? "Maximum"
                      : index == 1
                      ? "Standard"
                      : index == 2
                      ? "Lite"
                      : "Advance"}
                  </h3>

                  <ul
                    className={`nav nav-tabs apool__tabs apool__tabs--${
                      index == 0
                        ? "orange"
                        : index == 1
                        ? "green"
                        : index == 2
                        ? "blue"
                        : "orange"
                    }`}
                    id={
                      index == 0
                        ? "apool__tabs1"
                        : index == 1
                        ? "apool__tabs2"
                        : index == 2
                        ? "apool__tabs2"
                        : ""
                    }
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="active"
                        data-bs-toggle="tab"
                        data-bs-target={
                          index == 0
                            ? "#atab-1"
                            : index == 1
                            ? "#atab-3"
                            : index == 2
                            ? "#atab-5"
                            : ""
                        }
                        type="button"
                        role="tab"
                        aria-controls={
                          index == 0
                            ? "atab-1"
                            : index == 1
                            ? "atab-3"
                            : index == 2
                            ? "atab-5"
                            : ""
                        }
                        aria-selected="true"
                      >
                        {pool.lockDays} Days
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        data-bs-toggle="tab"
                        data-bs-target={
                          index == 0
                            ? "#atab-2"
                            : index == 1
                            ? "#atab-4"
                            : index == 2
                            ? "#atab-6"
                            : ""
                        }
                        type="button"
                        role="tab"
                        aria-controls={
                          index == 0
                            ? "atab-2"
                            : index == 1
                            ? "atab-4"
                            : index == 2
                            ? "atab-6"
                            : ""
                        }
                        aria-selected="false"
                      >
                        Details
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id={
                        index == 0
                          ? "atab-1"
                          : index == 1
                          ? "atab-3"
                          : index == 2
                          ? "atab-5"
                          : ""
                      }
                      role="tabpanel"
                    >
                      <div className="apool__content">
                        <span className="apool__value">
                          Deposited: {pool?.amount} {pool?.depositToken.symbol}
                        </span>
                        <span className="apool__profit">
                          Reward: <b>{pool?.userReward}</b>{" "}
                          {pool?.rewardToken.symbol}
                        </span>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id={
                        index == 0
                          ? "atab-2"
                          : index == 1
                          ? "atab-4"
                          : index == 2
                          ? "atab-6"
                          : ""
                      }
                      role="tabpanel"
                    >
                      <div className="apool__content">
                        <span className="apool__value">
                          <b>{pool?.depositToken.symbol}&nbsp; &nbsp; </b>:{" "}
                          {pool?.depositToken.address.slice(0, 15)}
                          ... <FaRegCopy />
                        </span>
                        <span className="apool__value">
                          <b>{pool?.rewardToken.symbol}&nbsp; &nbsp; </b>:{" "}
                          {pool?.rewardToken.address.slice(0, 15)}
                          ...
                          <FaRegCopy />
                        </span>
                        <span className="apool__value">
                          <b>Current APY:&nbsp; &nbsp; </b>: {pool.apy} %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="apool__group">
                    <label htmlFor="pool1" className="apool__label">
                      Total Deposited amount
                    </label>
                    <input
                      style={{
                        backgroundColor: "transparent",
                      }}
                      className="apool__input"
                      placeholder={`${pool?.depositedAmount} ${pool?.depositToken.symbol}`}
                      disabled
                    />
                  </div>
                  <button
                    className="apool__btn"
                    data-bs-target="#modal-apool"
                    type="button"
                    data-bs-toggle="modal"
                    onClick={() => (
                      setPoolID(
                        index == 0 ? 0 : index == 1 ? 1 : index == 2 ? 2 : ""
                      ),
                      setSelectedPool(pool),
                      setSelectedToken(pool)
                    )}
                  >
                    Stake
                  </button>

                  <span
                    className={`block-icon block-icon--${
                      index == 0
                        ? "orange"
                        : index == 1
                        ? "green"
                        : index == 2
                        ? "blue"
                        : "orange"
                    }`}
                  >
                    <MdOutlineAttachMoney
                      style={{
                        color: "white",
                        fontSize: "1.5rem",
                      }}
                    />
                  </span>
                  <span className="screw screw--lines-tr" />
                </div>
              </div>
            ))
            .slice(0, 3)}
        </div>
      </div>
    </div>
  );
};

export default Pools;
