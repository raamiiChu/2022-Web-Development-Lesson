import React, { useState, useEffect } from "react";

import Search from "../components/Search.js";
import Photo from "../components/Photo.js";
import { v4 as uuidv4 } from "uuid";

const Homepage = () => {
    const [input, setInput] = useState("");
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [currSearch, setCurrSearch] = useState("");

    // console.log(process.env);
    const SearchURL = `https://api.pexels.com/v1/search?query=${currSearch}&page=${page}&per_page=15`;
    const Auth = process.env.REACT_APP_PEXELS_API_KEY;
    const InitialURL = "https://api.pexels.com/v1/curated?page=1&per_page=15";

    // fetch photo from Pexels api
    const search = async (url) => {
        setPage(2);

        try {
            const dataFetch = await fetch(url, {
                method: "GET",
                headers: { Accept: "application/json", Authorization: Auth },
            });

            let parsedData = await dataFetch.json();
            setPhotos(parsedData.photos);
        } catch (error) {
            console.log(error);
        }
    };

    const morePhoto = async () => {
        let newUrl;

        if (input === "") {
            newUrl = `https://api.pexels.com/v1/curated?page=${page}&per_page=15`;
        } else {
            newUrl = `https://api.pexels.com/v1/search?query=${currSearch}&page=${page}&per_page=15`;
        }

        setPage(page + 1);

        try {
            const dataFetch = await fetch(newUrl, {
                method: "GET",
                headers: { Accept: "application/json", Authorization: Auth },
            });

            let parsedData = await dataFetch.json();
            setPhotos(photos.concat(parsedData.photos));
        } catch (error) {
            console.log(error);
        }
    };

    // fetch photos when the page loads up
    useEffect(() => {
        search(InitialURL);
    }, []);

    // avoiding closure
    useEffect(() => {
        if (currSearch === "") {
            search(InitialURL);
        } else {
            search(SearchURL);
        }
    }, [currSearch]); // when click "search", currSearch change

    return (
        <div style={{ minHeight: "100vh" }}>
            <Search
                search={(e) => {
                    e.preventDefault();
                    setCurrSearch(input); // save current input
                }}
                setInput={setInput}
            />

            <div className="photos">
                {photos.map((photo) => {
                    return <Photo key={uuidv4()} photo={photo} />;
                })}
            </div>

            <div className="more-photo" onClick={morePhoto}>
                <button>Load More</button>
            </div>
        </div>
    );
};

export default Homepage;
