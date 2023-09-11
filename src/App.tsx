import React from "react";

function App() {
  return (
    <div className="App">
      <button
        onClick={() =>
          (window.location.href = "http://localhost:3001/auth/reddit")
        }
      >
        Connect with Reddit
      </button>
      {/* Additional components and UI elements */}
    </div>
  );
}

export default App;
