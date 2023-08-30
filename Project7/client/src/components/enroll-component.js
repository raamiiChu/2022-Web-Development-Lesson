import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CourseService from "../services/course.service";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
    const history = useNavigate();

    let [searchInput, setSearchInput] = useState("");
    let [searchResult, setSearchResult] = useState([]);

    const handleTakeToLogin = () => {
        history("/login");
    };

    const handleChangeInput = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            let result = await CourseService.getCourseByName(searchInput);
            // console.log(result);
            setSearchResult(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();

        try {
            await CourseService.enroll(e.target.id, currentUser.user._id);
            alert("Done Enrollment");
            history("/course");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={{ padding: "3rem" }}>
            {!currentUser && (
                <div>
                    <p>You must login first before searching for courses.</p>
                    <button
                        class="btn btn-primary btn-lg"
                        onClick={handleTakeToLogin}
                    >
                        Take me to login page.
                    </button>
                </div>
            )}
            {currentUser && currentUser.user.role === "instructor" && (
                <div>
                    <h1>Only students can enroll in courses.</h1>
                </div>
            )}
            {currentUser && currentUser.user.role === "student" && (
                <form className="search input-group mb-3">
                    <input
                        onChange={handleChangeInput}
                        type="text"
                        class="form-control"
                    />
                    <button onClick={handleSearch} className="btn btn-primary">
                        Search
                    </button>
                </form>
            )}
            {currentUser && searchResult && searchResult.length !== 0 && (
                <div>
                    <p>Data we got back from API.</p>
                    {searchResult.map((course) => (
                        <div
                            key={course._id}
                            className="card"
                            style={{ width: "18rem" }}
                        >
                            <div className="card-body">
                                <h5 className="card-title">{course.title}</h5>
                                <p className="card-text">
                                    {course.description}
                                </p>
                                <p>Price: {course.price}</p>
                                <p>Student: {course.students.length}</p>
                                <a
                                    href="#"
                                    onClick={handleEnroll}
                                    className="card-text btn btn-primary"
                                    id={course._id}
                                >
                                    Enroll
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnrollComponent;
