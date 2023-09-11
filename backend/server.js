import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as RedditStrategy } from "passport-reddit";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Load environment variables from a secret
dotenv.config();

const app = express();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const REDDIT_API_BASE = "https://oauth.reddit.com";

// Set up CORS for handling cross-origin requests
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
    credentials: true,
  })
);

// Initialize session middleware for handling user sessions
app.use(
  session({
    secret: "some-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport middleware for handling authentication
app.use(passport.initialize());
app.use(passport.session());

// Define Reddit OAuth2 for passport
passport.use(
  new RedditStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "http://localhost:5000/auth/reddit/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      profile.token = accessToken; // Attach token to user profile for later use
      return done(null, profile);
    }
  )
);

// Serialize user instance to the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user instance from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Endpoint for Reddit authentication (begins OAuth2 flow)
app.get(
  "/auth/reddit",
  passport.authenticate("reddit", {
    scope: ["identity", "mysubreddits"], // Request access to user's identity and subreddits
  })
);

// Callback endpoint for Reddit to redirect after user authentication
app.get(
  "/auth/reddit/callback",
  passport.authenticate("reddit", { failureRedirect: "/" }),
  (req, res) => {
    console.log("Authenticated Successfully from server.ts");
    res.redirect("http://localhost:3000");
  }
);

// Endpoint to fetch top 10 subreddits the authenticated user is subscribed to
app.get("/get-user-subreddits", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  const response = await fetch(
    `${REDDIT_API_BASE}/subreddits/mine/subscriber?limit=10`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.user.token}`,
        "User-Agent": "EthosPoC/0.0.1",
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    res.json(data);
  } else {
    res.status(500).json({ message: "Failed to retrieve subreddits!" });
  }
});

// Basic endpoint to check authentication status
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "You are authenticated!", user: req.user });
  } else {
    res.json({ message: "Welcome to the server!" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
