import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recover.css";
import "../../styles/global.css";

export default function Recover() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [popOpen, setPopOpen] = useState(false); // Popup for cancellation
  const [popConfirmedOpen, setPopConfirmedOpen] = useState(false); // Popup for success
  const navigate = useNavigate();

  // Function to handle the email input change
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(""); // Clear any existing error when the email is updated
  };

  // Function to open the cancellation popup
  const togglePopupCancelled = () => {
    setPopOpen(true); // Show the cancellation popup
  };

  // Function to close the cancellation popup
  const closePopupCancelled = () => {
    setTimeout(() => {
      setPopOpen(false);
      navigate("/");
    }, 1500);
  };

  // Function to simulate sending the email successfully (You can replace this with the actual backend call)
  const togglePopUpEmailSent = () => {
    setPopConfirmedOpen(true); // Open the "Email Sent" confirmation popup
    setEmail(""); // Clear the email input
    console.log("EMAIL WAS SENT SUCCESSFULLY");

    // After the user closes the popup, navigate to the reset password page
    /*
      USE TRY CATCH FOR EMAIL
      try {
        const connectionAPI = (API url)


        if(connection.ok){
          console.log("email was sent.")
          show popup
        } else {
          error sending email, we can use console.log to see on terminal as well 
        }
      } catch (error) {
          // IF THERE WAS AN ERROR CONNECTING TO API
        }
    */
  };

  // Function to handle the email submission (validation and sending)
  const handleEmailSubmition = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault(); // Prevent the default form submission

    // Validation of the email
    if (!email || email.trim() === "") {
      setError("Enter a valid email!"); // Show error message if email is empty or invalid
    } else {
      console.log("Email sent."); // Log email to the console
      setError(""); // Clear any previous errors
      togglePopUpEmailSent(); // Trigger the popup for email sent
    }
  };

  // Function to handle closing the "Email Sent" popup
  const handleClosePopUp = () => {
    setTimeout(() => {
      setPopConfirmedOpen(false);
      navigate("/passwordInput");
    }, 1500);
  };

  // Function to handle the Enter key press (submit email)
  const handleEnterKey = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default action of the Enter key
      const syntheticEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      event.currentTarget.dispatchEvent(syntheticEvent); // Trigger the email submission when Enter is pressed
    }
  };

  return (
    <div className="body">
      <div className="card">
        <div className="card-body">
          <img src="/pokemon.png" alt="Pokemon Logo"></img>
          <h3>Pokemon Battle Arena</h3>
          <h5>Recover your password</h5>
          <form onSubmit={handleEmailSubmition}>
            <div className="form-email">
              <label htmlFor="emailInput"></label>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmail}
                onKeyDown={handleEnterKey}
              />
              {error && <p className="error-message">{error}</p>}
              <div className="button-container">
                <button
                  onClick={() => {
                    togglePopupCancelled();
                    closePopupCancelled();
                  }}
                  className="back-btn"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    togglePopUpEmailSent();
                    handleClosePopUp();
                  }}
                  type="submit"
                  className="submit-email-btn"
                >
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
            </div>
          </div>
        </div>
      )}

      {popConfirmedOpen && (
        <div className="popup-overlay">
          <div className="popup-body">
            <div className="popup-content">
              <h2>Email Sent!</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
