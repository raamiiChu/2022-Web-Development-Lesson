const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const fs = require("fs");

// connect to mongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/exampleDB")
    .then(() => {
        console.log("Connected!");
    })
    .catch((error) => {
        console.log("Failed!");
        console.log(error);
    });

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [20, "name is too long"],
        required: true,
    },
    age: {
        type: Number,
        required: true,
        max: 100,
        default: 18,
    },
    major: {
        type: String,
        enum: [
            "Chem",
            "Electrical Engineering",
            "Computer Science",
            "undecided",
        ],
        default: "undecided",
    },
    scholarship: {
        type: Object,
        merit: {
            type: Number,
            min: 0,
        },
        other: {
            type: Number,
            min: 0,
        },
    },
});

// define middleware
studentSchema.pre("save", async function () {
    fs.writeFile("record.txt", "One data is trying to be saved", (e) => {
        if (e) {
            throw e;
        }
    });
});

studentSchema.post("save", async function () {
    fs.appendFile("record.txt", "\nOne data has been saved", (e) => {
        if (e) {
            throw e;
        }
    });
});

// create a model for students
const Student = mongoose.model("Student", studentSchema);

const newStudent = new Student({
    name: "Kate",
    age: 22,
    major: "Chem",
    scholarship: {
        merit: 0,
        other: 0,
    },
});

newStudent
    .save()
    .then(() => {
        console.log("Saved!!");
    })
    .catch((error) => {
        console.log("Not Saved!!");
    });

app.use(express.static("public"));

app.get("/", (request, response) => {
    response.render("index.ejs");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
