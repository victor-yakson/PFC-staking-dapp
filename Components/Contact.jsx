import React from "react";
import { useForm, ValidationError } from "@formspree/react";
import toast from "react-hot-toast";

const FORMSPREE_API = process.env.NEXT_PUBLIC_FORMSPREE_API;

//INTERNAL IMPORT
import { IoMdClose } from "../Components/ReactICON";

const Contact = ({ setContactUs }) => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const [state, handleSubmit] = useForm(FORMSPREE_API);
  if (state.succeeded) {
    return notifySuccess("Message sent successfully");
  }
  return (
    <div
      className="modal modal--auto fade show"
      id="modal-ask"
      tabIndex={-1}
      aria-labelledby="modal-ask"
      aria-modal="true"
      role="dialog"
      style={{ display: "block", paddingLeft: 0 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal__content">
            <button
              className="modal__close"
              onClick={() => setContactUs(false)}
            >
              <i className="ti ti-x">
                <IoMdClose />
              </i>
            </button>
            <h4 className="modal__title">Ask a question</h4>
            <p className="modal__text">
              Our support team is always on call, and ready to help with all
              your questions!
            </p>
            <form onSubmit={handleSubmit} className="modal__form">
              <div className="form__group">
                <input
                  name="name"
                  id="name"
                  type="name"
                  className="form__input"
                  placeholder="Name"
                />
              </div>
              <div className="form__group">
                <input
                  className="form__input"
                  placeholder="Email"
                  id="email"
                  type="email"
                  name="email"
                />{" "}
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                />
              </div>
              <div className="form__group">
                <textarea
                  id="message"
                  type="message"
                  name="message"
                  className="form__textarea"
                  placeholder="Your question"
                  defaultValue={""}
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
                />
              </div>
              <button
                className="form__btn"
                type="submit"
                disabled={state.submitting}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
