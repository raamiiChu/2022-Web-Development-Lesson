import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/index.js";

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = process.env.PASSPORT_SECRET;

passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            let foundUser = await User.findOne({ _id: jwt_payload._id });

            if (foundUser) {
                return done(null, foundUser);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(err, false);
        }
    })
);
