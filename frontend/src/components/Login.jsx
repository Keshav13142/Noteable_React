import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Navbar from "./Navbar";

const Login = () => {
  const { curr_user, setCurrUser, setInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });

  useEffect(() => {
    if (curr_user) navigate("/notes");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loginUser = async (e) => {
    e.preventDefault();
    const data = await fetch("/login", {
      method: "post",
      body: JSON.stringify(user),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    if (data.ok) {
      setInfo({
        open: true,
        message: "Logged in successfully",
        type: "success",
      });
      const user_data = await data.json();
      localStorage.setItem("user", JSON.stringify(user_data));
      setCurrUser(user_data);
      navigate("/notes");
    } else {
      const { error } = await data.json();
      setInfo({ open: true, message: error.info, type: "error" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container d-flex align-items-center flex-column gap-5 justify-content-center mt-2">
        <h2>Sign in to view your notes 📒</h2>
        <div className="card  text-bg-dark p-4 w-auto">
          <form onSubmit={loginUser}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                value={user.email}
                onChange={updateUser}
                required
                type="email"
                className="form-control"
                id="email"
                name="email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                value={user.password}
                onChange={updateUser}
                required
                type="password"
                className="form-control"
                id="password"
                name="password"
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <p className="mt-3">
              Don't have an account? Create one <Link to="/register">here</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
