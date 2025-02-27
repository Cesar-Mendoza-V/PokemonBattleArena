import React, { useState, useEffect } from "react";
import "./Signin.css";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Cargar email almacenado si "Remember Me" estuvo activado
  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    setEmailError("");

    // Validar el correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setEmailError("Please enter a valid email address");
      setIsButtonDisabled(true);
    } else {
      setEmailError("");
      setIsButtonDisabled(password === "");
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setIsButtonDisabled(emailError !== "" || email === "" || value === "");
  };

  const handleLogin = async () => {
    setLoginError("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          if (rememberMe) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("rememberedEmail", email);
          } else {
            sessionStorage.setItem("token", data.token);
            localStorage.removeItem("rememberedEmail"); // Eliminar email guardado si no se recuerda
          }
        }
        navigate("/Game");
      } else {
        setLoginError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setLoginError("Server error. Please try again later.");
    }
  };

  return (
    <div className="container">
      {/* Login Section */}
      <div className="login-section">
        <h2 className="title">Login.</h2>
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={handleEmailChange}
        />
        {emailError && <p className="error">{emailError}</p>}
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={handlePasswordChange}
        />
        {loginError && <p className="error">{loginError}</p>}
        <div className="options">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>
          <Link to="/recover" className="forgot-password">
            Forgot password?
          </Link>
        </div>
        <button
          className="button login-button"
          onClick={handleLogin}
          disabled={isButtonDisabled}
        >
          Login
        </button>
      </div>

      <div className="register-section">
        <h2 className="title">
          {" "}
          Embark on <br /> your Pokemon <br /> adventure!{" "}
        </h2>
        <p className="description">
          If you don’t have an account yet, <br /> join us and start your
          adventure.
        </p>
        <Link to="/signup">
          <button className="button register-button"> Register </button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
