import React from "react";

const Partners = () => {
  const partners = [
    {
      name: "SAFEPAL WALLET",
      image: "img/partners/logo1.jpg",
      url: "https://polyfarm.tech",
    },
    {
      name: "METAMASK",
      image: "img/partners/METAMASK.jpg",
      url: "https://polyfarm.tech",
    },
    {
      name: "WEB3.JS",
      image: "img/partners/logo3.webp",
      url: "https://polyfarm.tech",
    },
    {
      name: "ANKR RPC",
      image: "img/partners/logo4.png",
      url: "https://polyfarm.tech",
    },
    {
      name: "CoinGecKo Tokens Tracker",
      image: "img/partners/logo5.png",
      url: "https://polyfarm.tech",
    },
    {
      name: "Polygon Network",
      image: "img/partners/logo6.webp",
      url: "https://polyfarm.tech",
    },
    {
      name: "Dex Screener",
      image: "img/partners/logo7.png",
      url: "https://polyfarm.tech",
    },
    {
      name: "CoinMarketCap",
      image: "img/partners/logo8.jpg",
      url: "https://polyfarm.tech",
    },
  ];
  return (
    <section id="partners" className="section">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-8 offset-xl-2">
            <div className="section__title">
            <h2>Our partners</h2>
              <p>
              The time has come for $PFC to take a giant leap into an ultra-based future. By inseminating the world with De-Fi technological products, We're collaborating with our partners who is helping us
                provide the best services to our clients. If you'd like to
                become our partner, please
                <a href="#ask"> contact us.</a>
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          {partners.map((partner, index) => (
            <div key={index} className="col-6 col-lg-3">
              <a href={partner.link} className="partner">
                <img src={partner.image} alt="" />
                <p>{partner.name}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
