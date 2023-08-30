import "dotenv/config";
import express from "express";

// import ejs from "ejs";
import fetch from "node-fetch";
import bodyParser from "body-parser";

// import cookieParser from "cookie-parser";
// import session from "express-session";
// import flash from "connect-flash";

import { authRoute, courseRoute } from "./routes/index.js";

import passport from "passport";
import "./config/passport.js";

import { connect } from "mongoose";

import cors from "cors";

const app = express();
const port = 8080;

connect(process.env.DB_CONNECT)
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((error) => {
        console.log("Failed!");
        console.log(error);
    });

// app.set("view engine", "ejs");

// middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cookieParser(process.env.SECRET));
// app.use(
//     session({
//         secret: process.env.SECRET,
//         resave: false,
//         saveUninitialized: true,
//     })
// );

// app.use(flash());
// app.use((req, res, next) => {
//     // 放在 res.locals 裡的資料，所有的 view 都可以存取。
//     res.locals.success_msg = req.flash("success_msg"); // 設定 success_msg 訊息
//     res.locals.warning_msg = req.flash("warning_msg"); // 設定 warning_msg 訊息
//     res.locals.error_msg = req.flash("error_msg"); // 設定 error_msg 訊息
//     res.locals.error = req.flash("error"); // passport 專用
//     next();
// });

app.use("/api/user", authRoute);
app.use(
    "/api/courses",
    passport.authenticate("jwt", { session: false }),
    courseRoute
);

// home page
app.get("/", (req, res) => {
    res.send("Home Page");
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
