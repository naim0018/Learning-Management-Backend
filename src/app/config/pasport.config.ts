// import passport from "passport";
// import { OIDCStrategy } from "passport-azure-ad";
// import jwt from "jsonwebtoken";

// passport.use(new OIDCStrategy({
//     identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     responseType: 'code',
//     responseMode: 'form_post',
//     redirectUrl: process.env.REDIRECT_URI,
//     allowHttpForRedirectUrl: true, // dev only
//     scope: ['openid', 'profile', 'email'],
//     validateIssuer: true,
//     passReqToCallback: false
// }, (iss, sub, profile, accessToken, refreshToken, done) => {
//     if (!profile.oid) return done(new Error("No OID found"));

//     // Domain restriction
//     if (!profile._json.preferred_username.endsWith('@awcompaniesinc.com')) {
//         return done(new Error("Unauthorized domain"));
//     }

//     // User object
//     const user = {
//         id: profile.oid,
//         name: profile.displayName,
//         email: profile._json.preferred_username
//     };

//     return done(null, user);
// }));

// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((user, done) => done(null, user));
