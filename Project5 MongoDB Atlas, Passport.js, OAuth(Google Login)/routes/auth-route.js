import { Router } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/user-model.js";

const router = Router();
const saltRounds = 10;

// /auth/login 單純渲染網頁
router.get("/login", (req, res, next) => {
    // req.user 調取用戶資訊
    res.render("login", { user: req.user });
});

// 呼叫 passport 進行 Local 驗證
router.post(
    "/login",
    // middleware
    passport.authenticate("local", {
        failureRedirect: "/auth/login",
        failureFlash: "Wrong email or password",
    }),
    (req, res) => {
        if (req.session.returnTo) {
            res.redirect(req.session.returnTo);
            req.session.returnTo = "";
        } else {
            res.redirect("/profile");
        }
    }
);

// /auth/signup
router.get("/signup", (req, res) => {
    // req.user 調取用戶資訊
    res.render("signup", { user: req.user });
});

router.post("/signup", async (req, res, next) => {
    let { name, email, password } = req.body;

    // check if the data is in DB
    const emailExist = await User.findOne({ email });

    if (emailExist) {
        req.flash("error_msg", "Email has already exist!");
        res.redirect("/auth/signup");
        return;
    }

    // hash a password
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            next(err);
        }

        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                next(err);
            }

            // Store hash in your password DB.
            // myPlaintextPassword: hash
            let newUser = new User({
                name,
                email,
                password: hash,
            });

            try {
                let savedUser = await newUser.save();
                req.flash("success_msg", "Registration Succeed");
                res.redirect("/auth/login");
            } catch (error) {
                res.send(400);
                next(error);
            }
        });
    });
});

// /auth/logout
router.get("/logout", (req, res) => {
    // req.logOut() 登出
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
    });
    res.redirect("/");
});

// /auth/google 呼叫 passport 進行 Google 驗證
// 詳情見 config/passport.js
router.get(
    "/google",
    // middleware
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// 重新導向到個人頁面
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
        req.session.returnTo = "";
    } else {
        res.redirect("/profile");
    }
});

export default router;
