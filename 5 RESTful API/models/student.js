import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        default: 20,
        max: [80, "Too old!!!"],
    },
    scholarship: {
        type: Object,
        merit: {
            type: Number,
            min: 0,
            max: [5000, "Too much!!!"],
        },
        other: {
            type: Number,
            min: 0,
        },
    },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
