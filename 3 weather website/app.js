import express from "express";
const app = express();
const port = 3000;

import ejs from "ejs";
import fetch from "node-fetch";

// api key
const KEY = "";

// kelvin to celsius
function kelvinToCelsius(k) {
    return Math.round((k - 272.15) * 10) / 10;
}

// middleware
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/:city", async (req, res) => {
    let { city } = req.params;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`;

    // get response by node-fetch
    let data = await fetch(url);
    data = await data.json();

    // kelvin to celsius
    let { temp } = data.main;
    let temperature = kelvinToCelsius(temp);

    res.render("weather.ejs", { data, temperature });

    // 另一種寫法
    // fetch(url)
    //     .then((res) => {
    //         return res.json();
    //     })
    //     .then((data) => {
    //         let { temp } = data.main;
    //         let temperature = kelvinToCelsius(temp);

    //         res.render("weather.ejs", { data, temperature });
    //     });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
