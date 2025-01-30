import "./Signup.css";
import { useState } from "react";

interface FormData {
  email: string;
  password: string;
  confirmedPassword: string;
}

interface ValidPass {
  length: boolean;
  caps: boolean;
  numbers: boolean;
  special: boolean;
}

interface PostFormData {
  email: string;
  password: string;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidPassword(currPass: ValidPass) {
  return (
    currPass.length && currPass.caps && currPass.numbers && currPass.special
  );
}

function Signup() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const [validEmailText, setValidEmailText] = useState<boolean>(false);
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [confirmedPassText, setConfirmedPassText] = useState<boolean>(false);
  const [confirmedPass, setConfirmedPass] = useState<boolean>(false);

  const [validPassText, setValidPassText] = useState<boolean>(false);
  const [validPass, setValidPass] = useState<ValidPass>({
    length: false,
    caps: false,
    numbers: false,
    special: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      if (updatedFormData.password && updatedFormData.confirmedPassword) {
        setConfirmedPassText(true);
        setConfirmedPass(
          updatedFormData.password === updatedFormData.confirmedPassword
        );
      } else {
        setConfirmedPassText(false);
      }

      if (updatedFormData.email) {
        if (emailRegex.test(updatedFormData.email)) {
          setValidEmailText(false);
          setValidEmail(true);
        } else {
          setValidEmailText(true);
          setValidEmail(false);
        }
      } else {
        setValidEmailText(false);
        setValidEmail(false);
      }

      return updatedFormData;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validEmail) {
      const postData: PostFormData = {
        email: formData.email,
        password: formData.password,
      };
      console.log("Submitted Data:", postData);
    } else {
      console.log("not valid data");
    }
  };

  return (
    <div className="signup-container">
      <h1>Pokemon Battle Arena</h1>
      <h3>Create account</h3>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
          />
          {validEmailText && <p>Please write a valid email adress</p>}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="pass-validation">
            <ul>
              {validPass.length ? (
                <li>Must be at least 8 characters long</li>
              ) : (
                <></>
              )}
              {validPass.caps ? (
                <li>Must include one uppercase letter</li>
              ) : (
                <></>
              )}
              {validPass.numbers ? <li>Must include one number</li> : <></>}
              {validPass.special ? (
                <li>Must include one special character (!#$%&=)</li>
              ) : (
                <></>
              )}
            </ul>
          </div>
          <input
            type="password"
            name="confirmedPassword"
            placeholder="Confirm password"
            value={formData.confirmedPassword}
            onChange={handleChange}
          />
          {confirmedPassText && (
            <p>
              {confirmedPass
                ? "Las contraseñas coinciden"
                : "Las contraseñas no coinciden"}
            </p>
          )}
          <input className="submit-btn" type="submit" value="Sign up" />
        </form>
      </div>
    </div>
  );
}

export default Signup;
