import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user-model.js";
import bcrypt from "bcrypt";

// 執行順序為
// 1. passport.use()
// 2. passport.serializeUser()
// 3. passport.deserializeUser()

// serialize & deserialize
// 用途：在用戶登錄和每次請求之間保存用戶資訊
// 通常會藉由唯一標識 ( _id ) 來聯繫

// 將用戶資訊中的唯一標識儲存
passport.serializeUser((user, callback) => {
    console.log("Serializing User Now");
    callback(null, user._id); // user._id 傳給 deserializeUser()
});

// 重新加載用戶資訊
passport.deserializeUser(async (_id, callback) => {
    console.log("Deserializing User Now");
    try {
        let foundUser = await User.findById({ _id });
        console.log("Found User");

        // 將用戶資訊傳遞給 Passport
        // 之後能藉由 req.user 調取用戶資訊
        callback(null, foundUser);
    } catch (error) {
        console.log("User Not Found");
        console.log(error);
    }
});

// Local 驗證
passport.use(
    new LocalStrategy(async function (username, password, callback) {
        console.log(username, password);
        try {
            let foundUser = await User.findOne({ email: username });

            // 用戶不存在 => 沒有要認證使用者
            if (!foundUser) {
                return callback(null, false);
            }

            // Load hash from your password DB.
            bcrypt.compare(password, foundUser.password, (err, result) => {
                if (err) {
                    return callback(err, false);
                }

                if (result) {
                    // 將用戶資訊傳遞給 Passport
                    return callback(null, foundUser);
                } else {
                    // 認證失敗
                    return callback(null, false);
                }
            });
        } catch (error) {
            return callback(error, false);
        }
    })
);

// Google 驗證
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            // 成功驗證之後，會重新導向到這個 URL
            // 詳情見 routes/auth-route.js
            callbackURL: "/auth/google/redirect",
        },
        async function (accessToken, refreshToken, profile, callback) {
            // passport callback
            // console.log(profile);
            try {
                let foundUser = await User.findOne({ googleId: profile.id });

                if (foundUser) {
                    console.log("User already exist");

                    // 將用戶資訊傳遞給 Passport
                    callback(null, foundUser);
                } else {
                    let newUser = new User({
                        name: profile.displayName,
                        googleId: profile.id,
                        thumbnail: profile.photos[0].value,
                        email: profile.emails[0].value,
                    });

                    try {
                        await newUser.save();
                        console.log("New User Created!");

                        // 將用戶資訊傳遞給 Passport
                        callback(null, newUser);
                    } catch (error) {
                        console.log(error);
                        console.log("Failed!!");
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    )
);
