import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "../AuthContext/AuthContext";

import Landing from "../Landing/Landing";
import SignIn from "../Auth/SignIn";
import SignUp from "../Auth/SignUp";
import Dashboard from "../Dashboard/Dashboard";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route
        path="/signin"
        element={!user ? <SignIn /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/signup"
        element={!user ? <SignUp /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
