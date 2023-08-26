import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 1,
        maxlength: 255,
    },
    googleId: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    thumbnail: {
        type: String,
    },

    // local login
    email: {
        type: String,
    },
    password: {
        type: String,
        maxlength: 1024,
    },
});

const User = mongoose.model("User", userSchema);

export default User;
