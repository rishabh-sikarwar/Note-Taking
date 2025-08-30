import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../db.js";

const callbackURL = process.env.NODE_ENV === "production" 
  ? `${process.env.BACKEND_URL}/api/auth/google/callback`
  : `http://localhost:${process.env.PORT || 8000}/api/auth/google/callback`;

// Log the callback URL for debugging
console.log(`Google OAuth Callback URL: ${callbackURL}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`BACKEND_URL: ${process.env.BACKEND_URL}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails![0].value;

        // 1. Find a user by their email address first.
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          // 2. If the user exists, but doesn't have a googleId, link it.
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { email },
              data: { googleId: profile.id },
            });
          }
        } else {
          // 3. If no user with that email exists, create a new user.
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName,
              email: email,
              dateOfBirth: null,
            },
          });
        }

        return done(null, user);
      } catch (error: any) {
        return done(error, false);
      }
    }
  )
);
