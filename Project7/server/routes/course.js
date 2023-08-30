import { Router } from "express";
import { Course } from "../models/index.js";
import { courseValidation } from "../validation.js";

const courseRoute = Router();

courseRoute.use((req, res, next) => {
    console.log("A request is coming into api...");
    next();
});

// find all courses
courseRoute.get("/", async (req, res) => {
    try {
        // 關連式資料庫
        let courses = await Course.find({}).populate("instructor", [
            "userName",
            "email",
        ]);
        res.send(courses);
    } catch (error) {
        res.status(500).send("Cannot get courses");
    }
});

// find courses by its constructor
courseRoute.get("/instructor/:_instructor_id", async (req, res) => {
    let { _instructor_id } = req.params;
    try {
        let FoundCourses = await Course.find({
            instructor: _instructor_id,
        }).populate("instructor", ["userName", "email"]);
        res.send(FoundCourses);
    } catch (error) {
        res.status(500).send("Can not get courses data");
    }
});

courseRoute.get("/findByName/:name", async (req, res) => {
    let { name } = req.params;

    try {
        let foundCourse = await Course.find({ title: name }).populate(
            "instructor",
            ["userName", "email"]
        );
        res.status(200).send(foundCourse);
    } catch (error) {
        res.status(500).send(error);
    }
});

// get student's course
courseRoute.get("/student/:_student_id", async (req, res) => {
    let { _student_id } = req.params;

    try {
        let foundCourse = await Course.find({ students: _student_id }).populate(
            "instructor",
            ["userName", "email"]
        );
        console.log(foundCourse);
        res.status(200).send(foundCourse);
    } catch (error) {
        res.status(500).send("Can not get courses data");
    }
});

// find a course by its _id
courseRoute.get("/:_id", async (req, res) => {
    let { _id } = req.params;

    try {
        let foundCourse = await Course.findOne({ _id }).populate("instructor", [
            "email",
        ]);
        res.send(foundCourse);
    } catch (error) {
        res.status(500).send("Cannot get courses");
    }
});

// post a new course
courseRoute.post("/", async (req, res) => {
    // validate the inputs before making a new course
    console.log(req.body);
    const { error } = courseValidation(req.body);

    console.log(error);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let { title, description, price } = req.body;
    if (req.user.isStudent()) {
        res.status(400).send("Only instructor can post new courses");
        return;
    }

    let newCourse = new Course({
        title,
        description,
        price,
        instructor: req.user._id,
    });

    try {
        await newCourse.save();
        res.status(200).send("Course has been saved");
    } catch (error) {
        res.status(400).send("Cannot save course");
    }
});

// enroll
courseRoute.post("/enroll/:_id", async (req, res) => {
    let { _id } = req.params;
    let { user_id } = req.body;

    try {
        let foundCourse = await Course.findOne({ _id });

        foundCourse.students.push(user_id);
        await foundCourse.save();

        res.status(200).send("Done Enrollment");
    } catch (error) {
        res.status(400).send(error);
    }
});

// edit a course
courseRoute.patch("/:_id", async (req, res) => {
    const { error } = courseValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let { _id } = req.params;

    try {
        let foundCourse = await Course.findById(_id);
        if (!foundCourse) {
            res.status(404).json({
                success: false,
                message: "Course not found",
            });
            return;
        }

        if (foundCourse.instructor.equals(req.user._id) || req.user.isAdmin()) {
            try {
                await Course.findOneAndUpdate({ _id }, req.body, {
                    new: true,
                    runValidators: true,
                });
                res.send("Course Updated");
            } catch (error) {
                res.status(404).json({
                    success: false,
                    message: error,
                });
            }
        } else {
            res.status(403).json({
                success: false,
                message: "Only the instructor of this course can edit",
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// delete a course
courseRoute.delete("/:_id", async (req, res) => {
    let { _id } = req.params;

    try {
        let foundCourse = await Course.findById(_id);
        if (!foundCourse) {
            res.status(404).json({
                success: false,
                message: "Course not found",
            });
            return;
        }

        if (foundCourse.instructor.equals(req.user._id) || req.user.isAdmin()) {
            try {
                await Course.deleteOne({ _id });
                res.send("Course deleted");
            } catch (error) {
                res.status(404).json({
                    success: false,
                    message: error,
                });
            }
        } else {
            res.status(403).json({
                success: false,
                message: "Only the instructor of this course can delete",
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

export default courseRoute;
