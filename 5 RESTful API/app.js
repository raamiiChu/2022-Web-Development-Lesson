import express from "express";
import bodyParser from "body-parser";

import Student from "./models/student.js"; // 匯入 Student
import mongoose from "mongoose";

const app = express();
const port = 3000;

mongoose
    .connect("mongodb://127.0.0.1:27017/studentDB")
    .then(() => {
        console.log("Connected!");
    })
    .catch((error) => {
        console.log("Failed!");
        console.log(error);
    });

// middleware
app.use(bodyParser.urlencoded({ extended: true }));

// get all data
app.get("/students", async (req, res) => {
    try {
        let data = await Student.find({});
        res.send(data);
    } catch (error) {
        res.send("Error with finding data");
    }
});

// get data by id
app.get("/students/:id", async (req, res) => {
    let { id } = req.params;
    try {
        let data = await Student.findOne({ id });

        if (data !== null) {
            res.send(data);
        } else {
            res.status(404);
            res.send({ message: "Cannot find this student" });
        }
    } catch (error) {
        res.send(error);
    }
});

// post
app.post("/students", async (req, res) => {
    let { id, name, age, merit, other } = req.body;
    let newStudent = new Student({
        id,
        name,
        age,
        scholarship: { merit, other },
    });

    try {
        await newStudent.save();
        res.send({ message: "Successfully post a new student" });
    } catch (error) {
        res.send(error);
    }
});

// put
app.put("/students/:id", async (req, res) => {
    let originId = req.params.id;
    let { id, name, age, merit, other } = req.body;

    try {
        await Student.findOneAndUpdate(
            { id: originId },
            { id, name, age, scholarship: { merit, other } },
            { new: true, runValidators: true, overwrite: true }
        );

        res.send({ message: "Successfully updated the data" });
    } catch (error) {
        res.send("Error with updating data");
    }
});

class newData {
    constructor() {}

    setProperty(key, value) {
        if (key !== "merit" && key !== "other") {
            this[key] = value;
        } else {
            this[`scholarship.${key}`] = value;
        }
    }
}

// patch
app.patch("/students/:id", async (req, res) => {
    let originId = req.params.id;

    let newObject = new newData();
    for (const property in req.body) {
        newObject.setProperty(property, req.body[property]);
    }

    try {
        await Student.findOneAndUpdate({ id: originId }, newObject, {
            new: true,
            runValidators: true,
        });

        res.send({ message: "Successfully updated the data" });
    } catch (error) {
        res.send("Error with updating data");
    }
});

// delete data by id
app.delete("/students/delete/:id", async (req, res) => {
    let { id } = req.params;

    try {
        await Student.deleteOne({ id });
        res.send({ message: "Deleted successfully" });
    } catch (error) {
        res.send("Delete failed");
    }
});

// delete all data
app.delete("/students/delete", async (req, res) => {
    try {
        await Student.deleteMany({});
        res.send({ message: "Deleted all data successfully" });
    } catch (error) {
        res.send("Delete all data failed");
    }
});

// 其他頁面
app.get("*", (req, res) => {
    res.status(404);
    res.send("Not allowed");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
