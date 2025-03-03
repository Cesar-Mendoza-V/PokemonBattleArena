import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Game from "./pages/Game/Game";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import Recover from "./pages/Recover/Recover";
import Signout from "./pages/Signout/Signout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
