import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
    },
    role: {
        type: String,
        enum: ["student", "instructor"],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// create an instance method
userSchema.methods.isStudent = function () {
    return this.role === "student";
};

userSchema.methods.isInstructor = function () {
    return this.role === "instructor";
};

userSchema.methods.isAdmin = function () {
    return this.role === "admin";
};

// middleware
userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        // hash a password
        const hash = await bcrypt.hash(this.password, saltRounds);
        this.password = hash;
        next();
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function (password, callback) {
    // Load hash from your password DB.
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return callback(err, isMatch);
        }

        callback(null, isMatch);
    });
};

const User = mongoose.model("User", userSchema);

export default User;
