import React from "react";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav.js";
import Footer from "./components/Footer.js";

import Homepage from "./pages/Homepage.js";
import About from "./pages/About.js";

import "./styles/style.css";

const App = () => {
    return (
        <div className="App">
            <Nav />

            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
            </Routes>

            <Footer />
        </div>
    );
};

export default App;
