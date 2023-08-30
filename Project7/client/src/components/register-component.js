import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service.js";

const RegisterComponent = () => {
    const history = useNavigate();
    let [userName, setUserName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [role, setRole] = useState("");
    let [message, setMessage] = useState("");

    const formHandler = function (e, setFunc) {
        setFunc(e.target.value);
    };

    const registerHandler = async function (e) {
        e.preventDefault();

        try {
            await AuthService.register(userName, email, password, role);
            alert("Registration Succeed");
            history("/login");
        } catch (error) {
            setMessage(error.response.data);
        }
    };

    return (
        <div style={{ padding: "3rem" }} className="col-md-12">
            <div>
                {message && (
                    <div
                        className="alert alert-danger fs-3 text-center text-capitalize"
                        role="alert"
                    >
                        {message}
                    </div>
                )}
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        onChange={(e) => {
                            formHandler(e, setUserName);
                        }}
                    />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        className="form-control"
                        name="email"
                        onChange={(e) => {
                            formHandler(e, setEmail);
                        }}
                    />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        onChange={(e) => {
                            formHandler(e, setPassword);
                        }}
                    />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                        name="role"
                        className="form-select"
                        onChange={(e) => {
                            formHandler(e, setRole);
                        }}
                    >
                        <option value="" selected disabled>
                            Please select your role
                        </option>
                        <option value="student">student</option>
                        <option value="instructor">instructor</option>
                    </select>
                </div>
                <br />
                <button className="btn btn-primary" onClick={registerHandler}>
                    <span>Register</span>
                </button>
            </div>
        </div>
    );
};

export default RegisterComponent;
