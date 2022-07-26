import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { UserContext } from "../contexts/UserContext";

const Register = () => {
  //Create instance of useNavigate()
  const navigate = useNavigate();

  //Get hold of the global state
  const { setCurrUser, setInfo } = useContext(UserContext);

  //Create a state for maintaining user info
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  //Update the user's info on input change
  const updateUser = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //Executes when the Register button is clicked
  const registerUser = async (e) => {
    //Prevent the default action
    e.preventDefault();

    //Make a POST request to /register (backend API) with user's info in the requst body
    const data = await fetch("/register", {
      method: "post",
      body: JSON.stringify(user),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    //Check if status is success
    if (data.ok) {
      //Setting global state for Alert
      setInfo({
        open: true,
        message: "Registered successfully",
        type: "success",
      });
      //Get the user's data and JWT token and store it in the localstorage
      const user_data = await data.json();
      localStorage.setItem("user", JSON.stringify(user_data));
      setCurrUser(user_data);

      //Navigate to the notes page
      navigate("/notes");
    } else {
      //Get the error message
      const { error } = await data.json();

      //Setting global state for Alert
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
