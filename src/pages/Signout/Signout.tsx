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
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <h1>Pokemon Battle Arena</h1>
      <h2>Sign Out Page</h2>
    </>
  );
}

export default Signout;
