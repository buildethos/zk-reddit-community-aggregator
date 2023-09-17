import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as RedditStrategy } from "passport-reddit";
import dotenv from "dotenv";
import fetch from "node-fetch";
import admin from "firebase-admin";
import serviceAccount from "../src/config/ethos-zk-reddit-firebase-adminsdk-8mthp-a8334bd422.json" assert { type: "json" };

// Load environment variables from a secret
dotenv.config();

const app = express();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const REDDIT_API_BASE = "https://oauth.reddit.com";

// Firebase Admin Initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ethos-zk-reddit.firebaseio.com",
});

const db = admin.firestore();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "some-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new RedditStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "http://localhost:5000/auth/reddit/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      profile.token = accessToken;
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get(
  "/auth/reddit",
  passport.authenticate("reddit", {
    scope: ["identity", "mysubreddits"],
  })
);

app.get(
  "/auth/reddit/callback",
  passport.authenticate("reddit", { failureRedirect: "/" }),
  async (req, res) => {
    const user = req.user;
    const userRef = db.collection("users").doc(user.id.toString());
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        id: user.id,
        name: user.name,
        token: user.token, // Security consideration
      });
    }

    res.redirect("http://localhost:3000/dashboard");
  }
);

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
    const userCommunitiesRef = db
      .collection("users")
      .doc(req.user.id.toString())
      .collection("communities");
    const batch = db.batch();

    data.data.children.forEach((child) => {
      const communityRef = userCommunitiesRef.doc(child.data.id.toString());
      batch.set(communityRef, {
        id: child.data.id,
        name: child.data.display_name_prefixed,
      });
    });

    await batch.commit();
    res.json(data);
  } else {
    res.status(500).json({ message: "Failed to retrieve subreddits!" });
  }
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "You are authenticated!", user: req.user });
  } else {
    res.json({ message: "Welcome to the server!" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
