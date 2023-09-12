import React from "react";
import { Link } from "react-router-dom";

function SignIn() {
  return (
    <div>
      <h2>Login</h2>
      {/* Your login form fields here */}

      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default SignIn;
