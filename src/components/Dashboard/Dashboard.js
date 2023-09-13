import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../config/firebaseConfig";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [subreddits, setSubreddits] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);

    // Firebase auth observer
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup the observer when the component is unmounted
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return; // Don't fetch if not logged in with Firebase

    // Get the welcome message from server
    fetch("http://localhost:5000/")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => {
        console.error("Can't connect to server:", error);
      });

    // Try fetching the user's subreddits if they're authenticated
    fetch("http://localhost:5000/get-user-subreddits", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.children) {
          setSubreddits(
            data.data.children.map((child) => child.data.display_name_prefixed)
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching subreddits:", error);
      });
  }, [user]);

  if (!user) {
    return <p>Please sign in to view your dashboard.</p>;
  }

  return (
    <div>
      <h1>Reddit Auth</h1>
      <p>{message}</p>
      <a href="http://localhost:5000/auth/reddit">Login with Reddit</a>
      <h2>Your Subreddits:</h2>
      <ul>
        {subreddits.map((subreddit) => (
          <li key={subreddit}>{subreddit}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
