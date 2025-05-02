import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import "./Recover.css";
import "../../styles/global.css";
import { postSendEmail, postVerifyCode } from "../../api/postRequests";

export default function Recover() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (!emailValue.trim()) {
      setError("Enter a valid email!");
    } else {
      setError("");
    }
  };

  const handleEmailSubmission = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Enter a valid email!");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
    } else {
      postSendEmail({ email: email }).then((response) => {
        response.success
          ? setShowPopup(true)
          : setError("Failed to send email.");
      });
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setCodeError("");
  };

  const handleCodeVerification = (event: React.FormEvent) => {
    event.preventDefault();

    postVerifyCode({ email: email, code: code }).then((response) => {
      if (response.success) {
        setCodeError("");
        console.log("Code verified.");
        setIsCodeVerified(true);
        setShowPopup(false);
      } else {
        setCodeError("Invalid code. Please try again.");
      }
    });
  };

  // Function to handle "Enter" key press for submit
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (showPopup) {
        handleCodeVerification(event as unknown as React.FormEvent);
      } else {
        handleEmailSubmission(event as unknown as React.FormEvent);
      }
    }
  };

  return (
    <div className="fullscreen-containers">
      {isCodeVerified ? (
        <PasswordInput />
      ) : (
        <div className="form-containers">
          <h3>Pokemon Battle Arena</h3>
          <h5>Recover your password</h5>
          <form
            className="form-inputs"
            onSubmit={handleEmailSubmission}
            onKeyDown={handleKeyPress}
          >
            <input
              type="email"
              className="form-controls"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmail}
              required
            />
            {error && <p className="error-message">{error}</p>}
            <div className="button-container">
              <button onClick={() => navigate("/")} className="back-btn">
                Back
              </button>
              <button type="submit" className="submit-email-btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {showPopup && !isCodeVerified && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h3>Verify your email</h3>
            <h6>Enter the verification code</h6>
            <form onSubmit={handleCodeVerification} onKeyDown={handleKeyPress}>
              <input
                type="text"
                className="form-control-popup"
                placeholder="Enter your code"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                required
              />
              {codeError && <p className="error-message">{codeError}</p>}
              <div className="buttons-container">
                <button
                  onClick={() => setShowPopup(false)}
                  className="back-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-email-btn">
                  Verify Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
