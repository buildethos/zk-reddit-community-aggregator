import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/reddit", passport.authenticate("reddit"));

router.get(
  "/reddit/callback",
  passport.authenticate("reddit", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication
    res.redirect("http://localhost:3000"); // Redirect to frontend
  }
);

module.exports = router;
