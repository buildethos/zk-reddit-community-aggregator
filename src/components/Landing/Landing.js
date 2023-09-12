import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <h1>Welcome to Ethos</h1>
      <p>Protecting your digital identity in the age of the internet.</p>
      <Link to="/signin">Log In</Link> or <Link to="/signup">Sign Up</Link>
    </div>
  );
}

export default Landing;
