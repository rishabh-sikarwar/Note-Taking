import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../db.js";

const callbackURL =
  process.env.NODE_ENV === "production"
    ? `${process.env.BACKEND_URL}/api/auth/google/callback`
    : `http://localhost:${process.env.PORT || 8000}/api/auth/google/callback`;

// Debug logging for initial configuration
console.log("Passport Configuration Loaded");
console.log("Generated callbackURL:", callbackURL);

// 1. Google Strategy Setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("--- Google Strategy Callback Fired ---");
      console.log("Profile received from Google:", profile);

      try {
        const email = profile.emails![0].value;
        let user = await prisma.user.findUnique({
          where: { email },
        });

        console.log("User found in DB:", user);

        if (user) {
          // If the user exists but signed up locally first, link their Google ID.
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { email },
              data: { googleId: profile.id },
            });
            console.log("Linked Google ID to existing user:", user);
          }
          return done(null, user);
        } else {
          // If no user exists with that email, create a new one.
          const newUser = await prisma.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails![0].value,
              dateOfBirth: null, // Placeholder
            },
          });
          console.log("New user created:", newUser);
          return done(null, newUser);
        }
      } catch (error: any) {
        console.error("!!! ERROR in Google Strategy !!!:", error);
        return done(error, false);
      }
    }
  )
);

// 2. Session Serialization
passport.serializeUser((user: any, done) => {
  console.log("--- Serializing User ---");
  console.log("User object to serialize:", user);
  done(null, user.id);
});

// 3. Session Deserialization
passport.deserializeUser(async (id: string, done) => {
  console.log("--- Deserializing User ---");
  console.log("User ID to deserialize:", id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    console.log("User found after deserializing:", user);
    done(null, user);
  } catch (error) {
    console.error("!!! ERROR in Deserializing User !!!:", error);
    done(error, null);
  }
});
