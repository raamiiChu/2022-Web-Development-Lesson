import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import methodOverride from "method-override";

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
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// home page
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// 展示所有 students (find)
app.get("/students", async (req, res) => {
    try {
        let data = await Student.find({});
        res.render("students.ejs", { data });
    } catch (error) {
        res.send("Error with finding data");
        console.log(error);
    }
});

// 輸入新資料 (create)
app.get("/students/insert", (req, res) => {
    res.render("studentInsert.ejs");
});

// 送出新資料 (create)
app.post("/students/insert", async (req, res) => {
    let { id, name, age, merit, other } = req.body;
    let newStudent = new Student({
        id,
        name,
        age,
        scholarship: { merit, other },
    });

    try {
        await newStudent.save();
        console.log("Student Accepted");
        res.render("accept.ejs");
    } catch (error) {
        console.log("Student not Accepted");
        console.log(err);
        res.render("reject.ejs");
    }

    // newStudent
    //     .save()
    //     .then(() => {
    //         console.log("Student Accepted");
    //         res.render("accept.ejs");
    //     })
    //     .catch((err) => {
    //         console.log("Student not Accepted");
    //         console.log(err);
    //         res.render("reject.ejs");
    //     });
});

// 獲取個人頁面 (find)
app.get("/students/:id", async (req, res) => {
    let { id } = req.params;
    try {
        let data = await Student.findOne({ id });

        if (data !== null) {
            res.render("studentPage.ejs", { data });
        } else {
            res.send("Cannot find this student!");
        }
    } catch (error) {
        console.log(error);
        res.send("Error!");
    }
});

// 修改資料 (update)
app.get("/students/edit/:id", async (req, res) => {
    let { id } = req.params;

    try {
        let data = await Student.findOne({ id });

        if (data !== null) {
            res.render("studentEdit.ejs", { data });
        } else {
            res.send("Cannot find this student!");
        }
    } catch (error) {
        console.log("Error!");
        console.log(error);
    }
});

// 送出修改資料 (update)
app.put("/students/edit/:id", async (req, res) => {
    let originId = req.params.id;
    let { id, name, age, merit, other } = req.body;

    try {
        await Student.findOneAndUpdate(
            { id: originId },
            { id, name, age, scholarship: { merit, other } },
            { new: true, runValidators: true }
        );

        res.redirect(`/students/${id}`);
    } catch (error) {
        res.render("reject.ejs");
        console.log(error);
    }
});

// 刪除資料 (delete)
app.delete("/students/delete/:id", async (req, res) => {
    let { id } = req.params;

    try {
        await Student.deleteOne({ id });
    } catch (error) {
        console.log(error);
    }
    res.redirect("/students");
});

// 其他頁面
app.get("*", (req, res) => {
    res.status(404);
    res.render("404page.ejs");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
