import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as RedditStrategy } from "passport-reddit";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.use(cors());

// Set up session
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
      // For now, let's just return the profile
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

app.get("/auth/reddit", passport.authenticate("reddit"));

app.get(
  "/auth/reddit/callback",
  passport.authenticate("reddit", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    console.log("Authenticated Successfully from server.ts");
    res.redirect("/");
  }
);

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
