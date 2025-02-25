import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PasswordInput.css";
import "../../styles/global.css";

// Function to show the password requirements
const getPasswordRequirements = () => {
  const requirements = [
    { id: 1, text: "At least 8 characters", regex: /.{8,}/ },
    { id: 2, text: "One uppercase letter (A-Z)", regex: /[A-Z]/ },
    { id: 3, text: "One lowercase letter (a-z)", regex: /[a-z]/ },
    { id: 4, text: "One number (0-9)", regex: /[0-9]/ },
    {
      id: 5,
      text: "One special character (!@#$%^&*)",
      regex: /[!@#$%^&*]/,
    },
  ];

  return requirements;
};

export default function PasswordInput() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Function to validate via regex the passwords
  const validatePassword = (password: string) => {
    const requirements = getPasswordRequirements();
    const newErrors = requirements
      .filter((req) => !req.regex.test(password))
      .map((req) => req.text);
    setErrors(newErrors);
  };

  // Verificate the passwords
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);

    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  // Function to validate the passwords are correct
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    if (password !== newConfirmPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if the passwords meet all the requirements
    const requirements = getPasswordRequirements();
    const isValid =
      requirements.every((req) => req.regex.test(password)) &&
      password === confirmPassword;

    if (isValid) {
      setShowPopup(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
  };

  return (
    <div className="fullscreen-container">
      <div className="form-container">
        <div className="form-titles">
          <h3>Pokemon Battle Arena</h3>
          <h5>Enter your password</h5>
          <ul className="password-requirements">
            {getPasswordRequirements().map((requirement) => (
              <li
                key={requirement.id}
                className={
                  errors.includes(requirement.text) ? "error" : "valid"
                }
              >
                {requirement.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="forms-inputs">
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              className="passwordInput"
              placeholder="Enter your new password"
              value={password}
              onChange={handlePasswordChange}
            ></input>
            <input
              type="password"
              className="confirmPasswordInput"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            ></input>
            {passwordMatchError && (
              <p className="error-message">{passwordMatchError}</p>
            )}
            <div className="btn-container">
              <Link to="/">
                <button type="button" className="btn-back">
                  BACK
                </button>
              </Link>
              <button type="submit" className="btn-confirm">
                CONFIRM
              </button>
            </div>
          </form>
        </div>
      </div>
      {showPopup && (
        <div className="popup-complete-overlay">
          <div className="popup-complete">
            <p>Password Changed</p>
          </div>
        </div>
      )}
    </div>
  );
}
