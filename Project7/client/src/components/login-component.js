import React, { useState } from "react";
import { useNavigate } from "react-router";
import AuthService from "../services/auth.service.js";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
    const history = useNavigate();
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [message, setMessage] = useState("");

    const formHandler = function (e, setFunc) {
        e.preventDefault();
        setFunc(e.target.value);
    };

    const loginHandler = async function (e) {
        e.preventDefault();

        try {
            let response = await AuthService.login(email, password);

            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));

                setCurrentUser(AuthService.getCurrentUser());

                alert("Login Succeed");
                history("/profile");
            }
        } catch (error) {
            setMessage(error.response.data);
        }
    };

    return (
        <div style={{ padding: "3rem" }} className="col-md-12">
            <form>
                {message && (
                    <div
                        className="alert alert-danger fs-3 text-center text-capitalize"
                        role="alert"
                    >
                        {message}
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="username">Email</label>
                    <input
                        onChange={(e) => {
                            formHandler(e, setEmail);
                        }}
                        type="text"
                        className="form-control"
                        name="email"
                    />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={(e) => {
                            formHandler(e, setPassword);
                        }}
                        type="password"
                        className="form-control"
                        name="password"
                    />
                </div>
                <br />
                <div className="form-group">
                    <button
                        className="btn btn-primary btn-block"
                        onClick={loginHandler}
                    >
                        <span>Login</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginComponent;
