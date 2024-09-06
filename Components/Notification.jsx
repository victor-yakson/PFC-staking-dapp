import React from "react";

//INTERNAL IMPORT
import { SHORTEN_ADDRESS, copyAddress } from "../Context/index";
import { FaRegCopy } from "../Components/ReactICON";

const Notification = ({ poolDetails, page }) => {
  const notificationsArray = poolDetails?.notifications ?? [];
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          {page != "activity" && (
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
              <div className="section__title">
                <h2>Active Live Stake</h2>
                <p>
                Gain insights into your staking positions, track yields, and monitor the performance of your Assets all in one place.
                </p>
              </div>
            </div>
          )}

          <div className="col-12">
            <div
              className="deals scrollable-div"
              style={{ overflowX: "scroll" }}
            >
              <table className="deals__table">
                <thead>
                  <tr>
                    <th>TypeOf</th>
                    <th>Token</th>
                    <th>User</th>
                    <th>Pool ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationsArray
                    .map((notify, index) => (
                      <tr key={index}>
                        <td>
                          <div className="deals__text">{notify?.typeOf}</div>
                        </td>
                        <td>
                          <div className="deals__exchange">
                            <img
                              src="img/exchanges/polyfarmalert.jpg"
                              alt="ethereum"
                            />
                            <span className="green">
                              {poolDetails?.rewardToken.symbol}{" "}
                            </span>

                            <span className="red">
                              &nbsp; &nbsp;{" "}
                              <FaRegCopy
                                onClick={() =>
                                  copyAddress(poolDetails?.rewardToken.address)
                                }
                              />
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="deals__text deals__text--green">
                            {SHORTEN_ADDRESS(notify?.user)} &nbsp; &nbsp;
                            <span className="red">
                              <FaRegCopy
                                onClick={() => copyAddress(notify?.user)}
                              />
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="deals__text">{`#00-${notify?.poolID}`}</div>
                        </td>
                        <td>
                          <div className="deals__text deals__text--green">
                            {notify?.amount} {poolDetails?.rewardToken.symbol}{" "}
                          </div>
                        </td>
                        <td>
                          <div className="deals__text deals__text--sell">
                            {" "}
                            {notify?.timestamp}
                          </div>
                        </td>
                      </tr>
                    ))
                    .slice(0, 10)}
                </tbody>
              </table>
            </div>
          </div>

          {page != "activity" && (
            <div className="col-12">
              <div className="section__btns">
                <a href="/activities" className="section__btn">
                  View all activities
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Notification;
