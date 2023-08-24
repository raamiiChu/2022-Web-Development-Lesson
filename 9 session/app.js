require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
app.use(cookieParser(process.env.SECRET));
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());

app.get("/", (req, res) => {
    // console.log(process.env.SECRET);
    // console.log(req.session);
    req.flash("success_msg", "Successfully get to home page");
    res.send(`Welcome! ${req.flash("success_msg")}`);
});

app.get("/verifyUser", (req, res) => {
    req.session.isVerified = true;
    res.send("You are verified");
});

app.get("/secret", (req, res) => {
    if (req.session.isVerified) {
        res.send("I LOVE CRAB!!!");
    } else {
        res.status(403);
        res.send("You are not authorized to see the secret");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000.");
});
