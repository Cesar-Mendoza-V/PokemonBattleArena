import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Game from "./pages/Game/Game";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import Recover from "./pages/Recover/Recover";
import Signout from "./pages/Signout/Signout";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/game" element={<Game />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/recover" element={<Recover />} />
          <Route path="/signout" element={<Signout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
