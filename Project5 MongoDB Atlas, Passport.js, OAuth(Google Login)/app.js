import "dotenv/config";
import express from "express";

import ejs from "ejs";
import bodyParser from "body-parser";

import session from "express-session";
import flash from "connect-flash";

import { connect } from "mongoose";

import passport from "passport";
import authRoute from "./routes/auth-route.js";
import "./config/passport.js";
import profileRoute from "./routes/profile-route.js";

const app = express();
const port = 8080;

connect(process.env.DB_CONNECT)
    .then(() => {
        console.log("Connected!");
    })
    .catch((error) => {
        console.log("Failed!");
        console.log(error);
    });

app.set("view engine", "ejs");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 儲存 passport 的 cookies
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize()); // 初始化 Passport
app.use(passport.session()); // 通過 serializeUser 設置的標識，來恢復用戶資訊

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error"); // passport 專用
    next();
});

app.use("/auth", authRoute);
app.use("/profile", profileRoute);

// home page
app.get("/", (req, res) => {
    // req.user 調取用戶資訊
    res.render("index", { user: req.user });
});

app.get("*", (req, res) => {
    res.send("404 page not found");
});

// error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Something broke!");
});

app.listen(port, () => console.log("Server running on port " + port + "!"));
