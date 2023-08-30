import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import NavComponent from "./components/nav-component.js";
import HomeComponent from "./components/home-component.js";
import RegisterComponent from "./components/register-component.js";
import LoginComponent from "./components/login-component.js";
import ProfileComponent from "./components/profile-component.js";
import CourseComponent from "./components/course-component.js";
import PostCourseComponent from "./components/postCourse-component.js";
import EnrollComponent from "./components/enroll-component.js";

import AuthService from "./services/auth.service.js";

const App = () => {
    let [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        setCurrentUser(AuthService.getCurrentUser());
        console.log(currentUser);
    }, []);

    return (
        <div>
            <NavComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
            />
            <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="/register" element={<RegisterComponent />} />
                <Route
                    path="/login"
                    element={
                        <LoginComponent
                            currentUser={currentUser}
                            setCurrentUser={setCurrentUser}
                        />
                    }
                />
                <Route
                    path="/profile"
                    element={<ProfileComponent currentUser={currentUser} />}
                />
                <Route
                    path="/course"
                    element={
                        <CourseComponent
                            currentUser={currentUser}
                            setCurrentUser={setCurrentUser}
                        />
                    }
                />
                <Route
                    path="/postCourse"
                    element={
                        <PostCourseComponent
                            currentUser={currentUser}
                            setCurrentUser={setCurrentUser}
                        />
                    }
                />
                <Route
                    path="/enroll"
                    element={
                        <EnrollComponent
                            currentUser={currentUser}
                            setCurrentUser={setCurrentUser}
                        />
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
