import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import CourseService from "../services/course.service.js";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
    const history = useNavigate();
    let [courseData, setCourseData] = useState([]);

    const goToLoginPage = function (e) {
        e.preventDefault();
        history("/login");
    };

    useEffect(() => {
        let _id;

        if (currentUser) {
            _id = currentUser.user._id;
        }

        if (currentUser.user.role === "instructor") {
            CourseService.get(_id)
                .then((res) => {
                    setCourseData(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (currentUser.user.role === "student") {
            CourseService.getEnrolledCourses(_id)
                .then((res) => {
                    setCourseData(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    return (
        <div style={{ padding: "3rem" }}>
            {!currentUser && (
                <div>
                    <h1>You must login first</h1>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={goToLoginPage}
                    >
                        Go to Login Page
                    </button>
                </div>
            )}
            {currentUser && currentUser.user.role === "instructor" && (
                <div>
                    <h1>Welcome to Instructor's Page</h1>
                </div>
            )}

            {currentUser && currentUser.user.role === "student" && (
                <div>
                    <h1>Welcome to Student's Page</h1>
                </div>
            )}
            {currentUser && courseData.length !== 0 && (
                <div>
                    <p>Here's the data we got back from server</p>
                    {courseData.map((course) => {
                        return (
                            <div
                                key={uuidv4()}
                                className="card"
                                style={{ width: "18rem" }}
                            >
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {course.title}
                                    </h5>
                                    <p className="card-text">
                                        {course.description}
                                    </p>
                                    <p>
                                        Student Count: {course.students.length}
                                    </p>
                                    <button className="btn btn-primary">
                                        {course.price}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CourseComponent;
