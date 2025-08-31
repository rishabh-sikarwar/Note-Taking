import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../db.js";

const callbackURL =
  process.env.NODE_ENV === "production"
    ? `${process.env.BACKEND_URL}/api/auth/google/callback`
    : `http://localhost:${process.env.PORT || 8000}/api/auth/google/callback`;

// Debug logging
console.log("Passport Configuration:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("BACKEND_URL:", process.env.BACKEND_URL);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("Generated callbackURL:", callbackURL);

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
        let user = await prisma.user.findUnique({
          where: { email },
        });

        // If the user exists and doesn't have a googleId, link it.
        if (user) {
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { email },
              data: { googleId: profile.id },
            });
          }
          return done(null, user);
        } else {
          // If no user exists with that email, create a new one.
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails![0].value,
              dateOfBirth: null, // Using null as a placeholder.
            },
          });
          return done(null, user);
        }
      } catch (error: any) {
        return done(error, false);
      }
    }
  )
);

// Required for passport to work properly
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
