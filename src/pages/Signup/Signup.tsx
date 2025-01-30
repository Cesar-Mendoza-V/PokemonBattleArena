import "./Signup.css";
import { useState } from "react";

interface FormData {
  email: string;
  user: string,
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
    user: "",
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
    <div className="general-container">
      <div>
        <div className="side-container">
          <h1 className="signup-h1">Hello, your adventure awaits!</h1>
          <p className="signup-info-p">If you already have an account, login here and have fun.</p>
          <button className="signup-info-btn">Log in</button>
        </div>
      </div>
      <div>
        <div className="side-container">
          <h1 className="signup-h1">Create an account</h1>
          <div className="form">
            <form className="signup-form" onSubmit={handleSubmit}>
              <input
                className="signup-input"
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {validEmailText && <p>Please write a valid email adress</p>}
              <input
                className="signup-input"
                type="text"
                name="user"
                placeholder="User"
                value={formData.user}
                onChange={handleChange}
              />
              <input
                className="signup-input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {/* <div className="pass-validation">
                {isValidPassword(formData.password)}
                <ul>
                  {validPass.length && <li>Must be at least 8 characters long</li>}
                  {validPass.caps && <li>Must include one uppercase letter</li>}
                  {validPass.numbers && <li>Must include one number</li>}
                  {validPass.special && <li>Must include one special character (!#$%&=)</li>}
                </ul>
              </div> */}
              <input
                className="signup-input"
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
      </div>

    </div>

  );
}

export default Signup;
