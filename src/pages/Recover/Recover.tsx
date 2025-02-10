import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recover.css";
import "../../styles/global.css";

export default function Recover() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const navigate = useNavigate();

  // Code to simulate the verifiying code "DELETE AFTER BACKEND LOGIC WAS IMPLEMENTED"
  const correctCode = "123456";

  // Function to handle the email
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (!emailValue.trim()) {
      setError("Enter a valid email!");
    } else {
      setError("");
    }
  };

  // Function to handle the email type
  const handleEmailSubmission = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Enter a valid email!");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
    } else {
      console.log("Email sent.");
      setError("");
      setShowPopup(true);
    }
  };

  // Function to handle the typed code
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setCodeError("");
  };

  // Function to handle the code verification
  const handleCodeVerification = (event: React.FormEvent) => {
    event.preventDefault();

    if (code !== correctCode) {
      setCodeError("Invalid code. Please try again.");
    } else {
      setCodeError("");
      console.log("Code verified.");
      navigate("/passwordInput");
    }
  };

  return (
    <div className="fullscreen-containers">
      <div className="form-containers">
        <img src="/pokemon.png" alt="Pokemon Logo" className="logo" />
        <h3>Pokemon Battle Arena</h3>
        <h5>Recover your password</h5>
        <form
          onSubmit={handleEmailSubmission}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
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

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h3>Verify your email</h3>
            <h6>Enter the verification code</h6>
            <form
              onSubmit={handleCodeVerification}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            >
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
              <div className="button-containers">
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
