import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import Recover from "./pages/Recover/Recover";
import Signout from "./pages/Signout/Signout";
import PasswordInput from "./pages/Recover/PasswordInput";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/recover" element={<Recover />} />
          <Route path="/passwordInput" element={<PasswordInput />} />
          <Route path="/signout" element={<Signout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
