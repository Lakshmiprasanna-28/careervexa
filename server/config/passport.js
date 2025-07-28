// server/config/passport.js
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import User from "../models/User.js";
import dotenv from "dotenv";
import { getAdminWhitelist } from "./adminWhitelist.js";

dotenv.config();

const getUserRole = (email) =>
  getAdminWhitelist().includes(email.toLowerCase()) ? "admin" : "seeker";

const extractName = (profile) =>
  profile.displayName || profile.username || profile.emails?.[0]?.value?.split("@")[0] || "User";

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
  }, async (_, __, profile, done) => {
    try {
      const email = profile.emails[0].value.toLowerCase();
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: extractName(profile),
          email,
          password: "oauth_google_auth",
          role: getUserRole(email),
        });
      }
      done(null, user);
    } catch (err) {
      console.error("Google Auth Error:", err);
      done(err, null);
    }
  })
);

passport.use(
  new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/github/callback",
    scope: ["user:email"],
  }, async (_, __, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase() || `${profile.username}@github.com`;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: extractName(profile),
          email,
          password: "oauth_github_auth",
          role: getUserRole(email),
        });
      }
      done(null, user);
    } catch (err) {
      console.error("GitHub Auth Error:", err);
      done(err, null);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
