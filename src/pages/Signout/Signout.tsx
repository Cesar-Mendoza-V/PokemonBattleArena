import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/postRequests";
import "./Signout.css";

function Signout() {
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser();
    const timer = setTimeout(() => {
      navigate("/signin");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="signout-container">
      <div className="signout-card">
        <h1>See You Soon, Trainer!</h1>
        <div className="pokemon-logo"></div>
        <p>You have been successfully logged out from Pokémon Battle Arena.</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="redirect-text">Redirecting to login page...</p>
      </div>
    </div>
  );
}

export default Signout;
