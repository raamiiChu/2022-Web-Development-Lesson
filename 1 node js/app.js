const express = require("express");
const ejs = require("ejs");

const app = express();

// middle ware
app.use(express.static("public"));

app.get("/", (request, response) => {
    // database => an array of objects
    const languages = [
        { name: "Python", rating: 9.5, trending: "super hot" },
        { name: "Java", rating: 8.6, trending: "same" },
        { name: "C++", rating: 6.6, trending: "same" },
        { name: "PHP", rating: 2.5, trending: "decreasing" },
        { name: "JavaScript", rating: 8.5, trending: "same" },
    ];

    response.render("index.ejs", { languages });
});

// app.get("/:name", (request, response) => {
//     let { name } = request.params;
//     response.render("person.ejs", { name });
// });

// app.get("/jscode", (request, response) => {
//     response.render("jscode.ejs");
// });

// app.get("/form", (request, response) => {
//     response.render("form.ejs");
// });

// app.get("/response", (request, response) => {
//     let { name, age } = request.query;
//     response.render("response.ejs", { name, age });
// });

app.listen(3000, () => {
    console.log("Server is Running on port 3000");
});
