import { Router } from "express";
import Post from "../models/post_model.js";

const router = Router();

// middleware
const authCheck = (req, res, next) => {
    // req.isAuthenticated() 判斷是否登入 ( 認證 )
    if (req.isAuthenticated()) {
        // console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
        next();
    } else {
        res.redirect("/auth/login");
    }
};

router.get("/", authCheck, async (req, res) => {
    let postFound = await Post.find({ author: req.user.name });

    // req.user 調取用戶資訊
    res.render("profile", { user: req.user, posts: postFound });
    console.log(req.user);
});

router.get("/post", authCheck, (req, res) => {
    res.render("post", { user: req.user });
});

router.post("/post", async (req, res) => {
    let { title, content } = req.body;
    let newPost = new Post({ title, content, author: req.user.name });

    try {
        await newPost.save();
        res.status(200);
        res.redirect("/profile");
    } catch (error) {
        req.flash("error_msg", "Both title and content are required");
        res.redirect("/profile/post");
    }
});

export default router;
