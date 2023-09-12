import React from "react";
import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div>
      <h2>Sign Up</h2>
      {/* Your signup form fields here */}

      <p>
        Already have an account? <Link to="/signin">Log In</Link>
      </p>
    </div>
  );
}

export default SignUp;
