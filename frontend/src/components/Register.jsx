import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { UserContext } from "../contexts/UserContext";

const Register = () => {
  const navigate = useNavigate();
  const { setCurrUser, setInfo } = useContext(UserContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const updateUser = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const data = await fetch("/register", {
      method: "post",
      body: JSON.stringify(user),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    if (data.ok) {
      const user_data = await data.json();
      localStorage.setItem("user", JSON.stringify(user_data));
      setCurrUser(user_data);
      navigate("/notes");
    } else {
      const { error } = await data.json();
      console.log(error);
      setInfo({ open: true, message: error.info, type: "error" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container d-flex align-items-center flex-column gap-5 justify-content-center mt-2 ">
        <h2>Create your account</h2>
        <div className="card  text-bg-dark p-4 w-auto">
          <form onSubmit={registerUser} method="post">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                onChange={updateUser}
                value={user.name}
                required
                type="text"
                className="form-control"
                id="name"
                name="name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                onChange={updateUser}
                value={user.email}
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
                onChange={updateUser}
                value={user.password}
                required
                type="password"
                className="form-control"
                id="password"
                name="password"
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
            <p className="mt-3">
              Already have an account? Login <Link to="/login">here</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
