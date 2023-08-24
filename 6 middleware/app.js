const express = require("express");
const app = express();

const studentMiddleware = (req, res, next) => {
    console.log("This is student middleware");
    next();
};

const anotherMiddleware = (req, res, next) => {
    console.log("This is another middleware");
    next();
};

app.get("/", (req, res) => {
    res.send("Welcome to home page");
});

app.get("/student", studentMiddleware, anotherMiddleware, (req, res) => {
    res.send("Welcome to student page");
});

app.listen(3000, () => {
    console.log("Server running on port 3000.");
});
