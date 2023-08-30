import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service.js";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
    let [title, setTitle] = useState("");
    let [description, setDescription] = useState("");
    let [price, setPrice] = useState(0);
    let [courseData, setCourseData] = useState(null);
    let [message, setMessage] = useState("");

    const history = useNavigate();

    const handleTakeToLogin = () => {
        history.push("/login");
    };

    const formHandler = (e, setFunc) => {
        setFunc(e.target.value);
    };

    const postCourse = async (e) => {
        e.preventDefault();

        try {
            let response = await CourseService.post(title, description, price);
            alert(response.data);
            history("/course");
        } catch (error) {
            console.log(error);
            setMessage(error.response.data);
        }
    };

    return (
        <div style={{ padding: "3rem" }}>
            {!currentUser && (
                <div>
                    <p>You must login first before seeing posts.</p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleTakeToLogin}
                    >
                        Take me to login page.
                    </button>
                </div>
            )}

            {currentUser && currentUser.user.role === "instructor" && (
                <form className="form-group">
                    <label htmlFor="exampleForTitle">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="exampleForTitle"
                        className="form-control"
                        onChange={(e) => {
                            formHandler(e, setTitle);
                        }}
                    />
                    <br />

                    <label htmlFor="exampleForDescription">Description</label>
                    <textarea
                        name="description"
                        id="exampleForDescription"
                        className="form-control"
                        onChange={(e) => {
                            formHandler(e, setDescription);
                        }}
                    />
                    <br />

                    <label htmlFor="exampleForPrice">Price</label>
                    <input
                        type="number"
                        name="description"
                        id="exampleForPrice"
                        className="form-control"
                        onChange={(e) => {
                            formHandler(e, setPrice);
                        }}
                    />
                    <br />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={postCourse}
                    >
                        Submit
                    </button>
                    <br />
                    <br />
                    {message && (
                        <div
                            className="alert alert-danger text-capitalize"
                            role="alert"
                        >
                            {message}
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default CourseComponent;
