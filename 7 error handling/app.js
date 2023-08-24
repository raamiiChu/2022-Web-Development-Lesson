const express = require("express");
const app = express();

const mongoose = require("mongoose");

mongoose
    .connect("mongodb://127.0.0.1:27017/test")
    .then(() => {
        console.log("Connected!");
    })
    .catch((error) => {
        console.log("Failed!");
        console.log(error);
    });

const monkeySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
    },
});

const Monkey = mongoose.model("Monkey", monkeySchema);

app.get("/", async (req, res, next) => {
    try {
        let newMonkey = new Monkey({ name: "John" });

        try {
            await newMonkey.save();
            res.send("Data has been saved");
        } catch (error) {
            res.send(error);
        }
    } catch (error) {
        next(error); // 傳送錯誤給 error handler
    }
});

// error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Something broke!");
});

app.listen(3000, () => {
    console.log("Server running on port 3000.");
});
