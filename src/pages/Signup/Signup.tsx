import "./Signup.css";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast, Bounce } from 'react-toastify';

interface FormData {
  email: string;
  username: string,
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
  username: string;
  password: string;
}


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passLengthRegex = /^.{8,}$/;
const passCapsRegex = /[A-Z]/;
const passNumRegex = /\d/;
const passSpecialRegex = /[!#$%&=]/;

function Signup() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
    confirmedPassword: "",
  });

  const [validEmailText, setValidEmailText] = useState<boolean>(false);
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [confirmedPassText, setConfirmedPassText] = useState<boolean>(false);
  const [confirmedPass, setConfirmedPass] = useState<boolean>(false);

  const [validPass, setValidPass] = useState<ValidPass>({
    length: false,
    caps: false,
    numbers: false,
    special: false,
  });

  const [submitable, setSubmitable] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      // Password confirmation logic
      const passwordsMatch =
        updatedFormData.password && updatedFormData.confirmedPassword
          ? updatedFormData.password === updatedFormData.confirmedPassword
          : false;
      setConfirmedPass(passwordsMatch);
      setConfirmedPassText(
        updatedFormData.password && updatedFormData.confirmedPassword ? true : false
      );

      // Email validation logic
      const isEmailValid = emailRegex.test(updatedFormData.email);
      setValidEmail(isEmailValid);
      setValidEmailText(updatedFormData.email ? !isEmailValid : false);

      // Password validation logic
      const updatedValidPass = {
        length: !passLengthRegex.test(updatedFormData.password),
        caps: !passCapsRegex.test(updatedFormData.password),
        numbers: !passNumRegex.test(updatedFormData.password),
        special: !passSpecialRegex.test(updatedFormData.password),
      };
      setValidPass(updatedValidPass);

      // Check if all conditions are met
      const isFormSubmitable =
        isEmailValid &&
        !updatedValidPass.caps &&
        !updatedValidPass.length &&
        !updatedValidPass.numbers &&
        !updatedValidPass.special &&
        passwordsMatch &&
        updatedFormData.username.length >= 3;

      setSubmitable(isFormSubmitable);

      return updatedFormData;
    });
  };

  const resolveWithSomeData = new Promise(resolve => setTimeout(() => resolve("success"), 3000));
  const notify = () => (toast.promise(
    resolveWithSomeData,
    {
      pending: "Signing up user",
      success: {
        render: "User created succesfully!",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light"
      },
      error: "Error creating user",
    })
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validEmail && !validPass.caps && !validPass.length && !validPass.numbers && !validPass.special && confirmedPass) {
      const postData: PostFormData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      };
      console.log("Submitted Data:", postData);
      notify().then((data) => {
        setTimeout(() => {
          console.log(data)
          if (data == "success") {
            navigate('/')
          }
        }, 1500)
      })

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
          <Link to="/signin">
            <button className="signup-info-btn">Log in</button>
          </Link>
        </div>
      </div>
      <div>
        <div className="side-container">
          <h1 className="signup-h1">Create an account</h1>
          <div className="signup-form-container">
            <form className="signup-form" onSubmit={handleSubmit}>
              <input
                className="signup-input"
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {validEmailText && <p className="signup-warning">Please write a valid email address</p>}
              <input
                className="signup-input"
                type="text"
                name="username"
                placeholder="User"
                value={formData.username}
                onChange={handleChange}
              />
              {formData.username && formData.username.length < 3 && <p className="signup-warning">Must be 3 characters long</p>}
              <input
                className="signup-input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {(formData.password) && (
                <div className="pass-validation">
                  <AnimatePresence>
                    {validPass.length && (
                      <motion.p
                        className="signup-warning"
                        key={"length"}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                      >
                        Must be at least 8 characters long
                      </motion.p>
                    )}
                    {validPass.caps && (
                      <motion.p
                        className="signup-warning"
                        key={"caps"}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                      >
                        Must include one uppercase letter
                      </motion.p>
                    )}

                    {validPass.numbers && (
                      <motion.p
                        className="signup-warning"
                        key={"numbers"}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}

                      >
                        Must include one number
                      </motion.p>
                    )}
                    {validPass.special && (
                      <motion.p
                        className="signup-warning"
                        key={"special"}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                      >
                        Must include one special character (!#$%&=)
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <input
                className="signup-input"
                type="password"
                name="confirmedPassword"
                placeholder="Confirm password"
                value={formData.confirmedPassword}
                onChange={handleChange}
              />
              {confirmedPassText && (
                <p className="signup-warning">
                  {confirmedPass
                    ? "Passwords match"
                    : "Passwords don't match"}
                </p>
              )}
              <button
                className={`submit-btn ${!submitable ? "blocked-submit-btn" : ""}`}
                type="submit"
                disabled={!submitable}
              >Sign up
              </button>
            </form>
          </div>
        </div>
      </div >
      <ToastContainer />
    </div >
  );
}

export default Signup;
