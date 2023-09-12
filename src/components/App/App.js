import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Landing from "../Landing/Landing";
// import SignIn from "./components/Auth/SignIn";
// import SignUp from "./components/Auth/SignUp";
import Dashboard from "../Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        {/* <Route path="/signin" element={SignIn} />
        <Route path="/signup" element={SignUp} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
