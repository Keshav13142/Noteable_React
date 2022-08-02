import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";

const Register = () => {
  //Create instance of useNavigate()
  const navigate = useNavigate();

  //Get hold of the global state
  const { setCurrUser, setInfo, loading, setLoading } = useContext(UserContext);

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

    setLoading(true);

    //Make a POST request to /register (backend API) with user's info in the requst body
    const data = await fetch("/api/register", {
      method: "post",
      body: JSON.stringify(user),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    setLoading(false);

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
      console.log(error);

      //Setting global state for Alert
      setInfo({ open: true, message: error.info, type: "error" });
    }
  };

  const gitHubAuthRedirect = () => {
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
      "_self"
    );
  };

  return (
    <>
      <div className="container d-flex align-items-center flex-column gap-3 mt-5 justify-content-center mt-2 ">
        <h2>Create your account 👇</h2>
        <div className="card  text-bg-dark home-card">
          <div className="d-flex gap-3 justify-content-center align-items-center">
            Register with GitHub
            <Button
              color="success"
              onClick={gitHubAuthRedirect}
              variant="contained"
              endIcon={<GitHubIcon />}
              className="text-white"
            >
              GitHub
            </Button>
          </div>
          <hr />
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
              <LoadingButton
                size="small"
                loading={loading}
                loadingPosition="end"
                endIcon={<HowToRegIcon />}
                variant="contained"
                type="submit"
              >
                Register
              </LoadingButton>
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
