import React, { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  const fetchData = () => {
    fetch("http://localhost:5000/test-endpoint")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div className="App">
      <button onClick={fetchData}>Click to Fetch Data</button>
      <div>{message}</div>
    </div>
  );
}

export default App;
