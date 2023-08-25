import "dotenv/config";
import express from "express";

import ejs from "ejs";
import bodyParser from "body-parser";

import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";

import { connect } from "mongoose";
import User from "./models/user.js";

import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;

connect("mongodb://127.0.0.1:27017/test")
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET));
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());

const requireLogin = (req, res, next) => {
    if (req.session.isLogin) {
        next();
    } else {
        res.redirect("/login");
    }
};

// home page
app.get("/", (req, res) => {
    res.send("Home Page");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res, next) => {
    let { username, password } = req.body;

    // username check
    try {
        let foundUser = await User.findOne({ username });

        if (foundUser) {
            res.send(`<h1>Username has been taken</h1>`);
            return;
        }
    } catch (error) {
        next(error);
    }
    console.log("check ok");

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
            let newUser = new User({
                username,
                password: hash,
            });

            try {
                try {
                    await newUser.save();
                    res.send("Data has been saved");
                } catch (error) {
                    res.send("Error!");
                }
            } catch (error) {
                next(error);
            }
        });
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res, next) => {
    let { username, password } = req.body;

    try {
        let foundUser = await User.findOne({ username });
        if (foundUser) {
            bcrypt.compare(password, foundUser.password, (err, result) => {
                if (err) {
                    next(err);
                }

                if (result) {
                    req.session.isLogin = true;
                    res.redirect("/secret");
                } else {
                    res.send(`<h1>Username or Password not Correct</h1>`);
                }
            });
        } else {
            res.send(`<h1>Username or Password not Correct</h1>`);
        }
    } catch (error) {
        next(error);
    }
});

app.get("/secret", requireLogin, (req, res) => {
    res.render("secret");
});

app.get("*", (req, res) => {
    res.send("404 page not found");
});

// error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Server running on port ${port}!`));
