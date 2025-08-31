    import passport from "passport";
    import { Strategy as GoogleStrategy } from "passport-google-oauth20";
    import prisma from "../db.js";

<<<<<<< HEAD
const callbackURL = process.env.NODE_ENV === "production" 
  ? `${process.env.BACKEND_URL}/api/auth/google/callback`
  : `http://localhost:${process.env.PORT || 8000}/api/auth/google/callback`;

// Debug logging
console.log('Passport Configuration:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('BACKEND_URL:', process.env.BACKEND_URL);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('Generated callbackURL:', callbackURL);

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
=======
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await prisma.user.upsert({
              where: { googleId: profile.id },
              update: {}, // No updates needed if user exists
              create: {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails![0].value,
                // Google OAuth doesn't provide DOB, so we use a placeholder.
                dateOfBirth: null,
              },
>>>>>>> parent of 7da21dc (updated the already logged in logic)
            });

<<<<<<< HEAD
        return done(null, user);
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
=======
            return done(null, user);
          } catch (error: any) {
            return done(error, false);
          }
        }
      )
    );
>>>>>>> parent of 7da21dc (updated the already logged in logic)
