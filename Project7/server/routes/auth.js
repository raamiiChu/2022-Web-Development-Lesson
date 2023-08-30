import { Router } from "express";

import jwt from "jsonwebtoken";

import { User } from "../models/index.js";
import { registerValidation, loginValidation } from "../validation.js";

const authRoute = Router();

authRoute.use((req, res, next) => {
    console.log("A request is coming into auth.js");
    next();
});

authRoute.get("/testAPI", (req, res) => {
    const msgObj = {
        message: "Test API is working",
    };

    return res.json(msgObj);
});

authRoute.post("/register", async (req, res) => {
    console.log("Register!!");
    const { error } = registerValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let { userName, email, password, role } = req.body;

    // check if the user is already exist
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        res.status(400).send("Email has already been registered");
        return;
    }

    // register the user
    // password hash 的部分已經在 user-model 設定為 middleware
    const newUser = new User({ userName, email, password, role });
    console.log(newUser);
    try {
        const savedUser = await newUser.save();
        console.log(savedUser);
        res.status(200).send({
            msg: "Success",
            saveObject: savedUser,
        });
    } catch (error) {
        res.status(400).send("Registration Failed!");
    }
});

authRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // check the validation of data
    const { error } = loginValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    try {
        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            res.status(401).send("User not found");
        } else {
            // 比對 password 的部分已經在 user-model 設定為 methods
            foundUser.comparePassword(password, (err, isMatch) => {
                if (err) {
                    res.status(401).send(err);
                    return;
                }

                // create web token
                if (isMatch) {
                    const tokenObject = {
                        _id: foundUser._id,
                        email: foundUser.email,
                    };
                    const token = jwt.sign(
                        tokenObject,
                        process.env.PASSPORT_SECRET
                    );

                    res.send({
                        success: true,
                        token: "JWT " + token,
                        user: foundUser,
                    });
                } else {
                    res.status(401).send("Wrong Password!");
                }
            });
        }
    } catch (error) {
        res.status(400).send("Login Failed!");
    }
});

export default authRoute;
