    import passport from "passport";
    import { Strategy as GoogleStrategy } from "passport-google-oauth20";
    import prisma from "../db.js";

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
            });

            return done(null, user);
          } catch (error: any) {
            return done(error, false);
          }
        }
      )
    );
