import React from "react";

//INTERNAL IMPORT
import {
  TiSocialTwitter,
  TiSocialFacebook,
  TiSocialLinkedin,
} from "./ReactICON/index";

const Footer = () => {
  const social = [
    {
      link: "https://x.com/polyfarmcoin",
      icon: <TiSocialTwitter />,
    },
    {
      link: "https://t.me/polyfarms",
      icon: <TiSocialFacebook />,
    },
    {
      link: "https://whatsapp.com/channel/0029VanHnMpBPzjVZT6SIL2n",
      icon: <TiSocialLinkedin />,
    },
  ];
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-8 col-md-6 col-lg-6 col-xl-4 order-1 order-lg-4 order-xl-1">
            <div className="footer__logo">
              <img src="img/pfclogo.svg" alt="" />
            </div>

            <p className="footer__tagline">
            Congrats! <br />
            You're early to the party! <br />
            Buy and Stake now during Presale to max out your rewards before the price skyrockets!.
            </p>
          </div>

          <div className="col-6 col-md-4 col-lg-3 col-xl-2 order-3 order-md-2 order-lg-2 order-xl-3 offset-md-2 offset-lg-0">
            <h6 className="footer__title">Quick Links</h6>
            <div className="footer__nav">
              <a href="https://polyfarm.tech/">ROI dApp</a>
            </div>
          </div>
          <div className="col-12 col-md-8 col-lg-6 col-xl-4 order-2 order-md-3 order-lg-1 order-xl-2">
            <div className="row">
              <div className="col-12">
                <h6 className="footer__title">Services &amp; Features</h6>
              </div>
              <div className="col-6">
                <div className="footer__nav">
                <a href="#">How To Buy PFC</a>
                <a href="#">Contact Us</a>
                </div>
              </div>
              <div className="col-6">
                <div className="footer__nav">
                  <a href="#">WTF is PFC?</a>
                  <a href="#">About</a>
                  <a href="#">Tokenomics</a>
                  <a href="#">RoadMap</a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-3 col-xl-2 order-4 order-md-4 order-lg-3 order-xl-4">
            <h6 className="footer__title">Join Community</h6>
            <div className="footer__nav">
              <a href="https://t.me/polyfarms">Telegram</a>
              <a href="https://whatsapp.com/channel/0029VanHnMpBPzjVZT6SIL2n">WhatsApp Channel</a>
              <a href="https://x.com/polyfarmcoin">X - Twitter</a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="footer__content">
              <div className="footer__social">
                {social.map((social, index) => (
                  <a key={index} href={social.link} target="_blank">
                    <i className="ti ti-brand-facebook">{social.icon}</i>
                  </a>
                ))}
              </div>

              <small className="footer__copyright">
                © Copy Rights 2024. 
                <a
                  href="https://www.polyfarm.tech"
                  target="_blank"
                >
                   @polyfarm.tech
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
