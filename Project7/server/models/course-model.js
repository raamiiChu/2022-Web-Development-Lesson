import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 1,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    students: {
        type: [String],
        default: [],
    },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
