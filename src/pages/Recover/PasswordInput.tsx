import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/global.css";
import "./PasswordInput.css";

export default function PasswordInput() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>(""); // useState for password erros
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>(""); // error on submitting the form of passwords
  const [popOpen, setPopOpen] = useState(false);

  // Function to alert user that the operation was cancelled
  const togglePopup = () => {
    setPopOpen(!popOpen);
  };

  // Function to write the password requirements
  const printPasswordRequirements = () => {
    const requirements =
      "Uppercase letter.\nLower case letter.\nDigits.\nSpecial characters.\n8 digit length.";
    return <pre>{requirements}</pre>;
  };

  // Validate the password with this requirments
  const validatePassword = (password: string) => {
    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%&().,:;?'{}|<>*+-_¿]/.test(password);
    const validLength = password.length >= 8;

    return {
      // returns the values of the requirements for the password
      isValid:
        validLength &&
        upperCase &&
        lowerCase &&
        hasDigit &&
        hasSpecialCharacter,
      errorMessages: [
        // returns the error messages if one requirement was not met
        !validLength && "Password must be at least 8 characters long",
        !upperCase && "Password must contain at least one uppercase letter",
        !lowerCase && "Password must contain at least one lowercase letter",
        !hasDigit && "Password must contain at least one number",
        !hasSpecialCharacter &&
          "Password must contain at least one special character",
      ].filter(Boolean),
    };
  };

  // Function to handle the password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const { isValid, errorMessages } = validatePassword(newPassword);

    if (!isValid) {
      setPasswordError(errorMessages.join(" | "));
    } else {
      setPasswordError(""); // LClean error message if the password is valid
    }
  };

  // Function to handle the confirm password change
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    // Validate if the confirmPassword match with password
    if (password !== newConfirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError(""); // Clean error if passwords match
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that passwords match
    if (password !== confirmPassword) {
      console.log("Passwords did not match."); // Print in console to verify it works
      setConfirmPasswordError("Passwords do not match");
      setPasswordError(""); // Clean errors
      return;
    }

    // Validate the password before continue to change
    const { isValid, errorMessages } = validatePassword(password);

    // If password is not valid, print the errors
    if (!isValid) {
      setPasswordError(errorMessages.join(" | "));
      setPasswordError(errorMessages.join(" | "));
      return;
    }

    // If everything is correct we can proceed
    console.log("Passwords match and are valid. Proceed with password reset.");
  };

  return (
    <div className="body">
      <div className="card">
        <div className="card-body">
          <img src="/pokemon.png" alt="Pokemon Logo"></img>
          <h3>Reset your password</h3>
          <h5>Enter your new password</h5>
          <div className="passwordRequirements">
            <p>Password requirements:</p>
            <pre>{printPasswordRequirements()}</pre>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-email">
              <label htmlFor="passwordInput"></label>
              <input
                type="password"
                className="form-control"
                id="passwordInput"
                placeholder="Enter your new password"
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}

              <label htmlFor="confirmPasswordInput"></label>
              <input
                type="password"
                className="form-control"
                id="confirmPasswordInput"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {confirmPasswordError && (
                <p className="error-message">{confirmPasswordError}</p>
              )}

              <div className="btn-container">
                <button onClick={togglePopup} className="back-btn">
                  Back
                </button>
                <button type="submit" className="submit-email-btn">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {popOpen && (
        <div className="popup-overlay">
          <div className="popup-body">
            <div className="popup-content">
              <h2>UPS! Operation cancelled</h2>
              <Link to="/">
                <button
                  onClick={() => setPopOpen(false)}
                  className="btn-popup-close"
                >
                  X
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
