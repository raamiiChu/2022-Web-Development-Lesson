const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser("thisismysecret"));

app.get("/", async (req, res) => {
    let { nation } = req.signedCookies;
    console.log(req.signedCookies);
    res.send(`Nation: ${nation}`);
});

app.get("/getSignedCookies", (req, res) => {
    res.cookie("nation", "Japan", { signed: true });
    res.send("Cookie has been send");
});

app.listen(3000, () => {
    console.log("Server running on port 3000.");
});
