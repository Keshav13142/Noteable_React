import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";

const Login = () => {
  //Get hold of the global state
  const { curr_user, setCurrUser, setInfo } = useContext(UserContext);

  //Create instance of useNavigate()
  const navigate = useNavigate();

  //Create a state for maintaining user info
  const [user, setUser] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);

  //Runs on mount to check if a session is already active
  useEffect(() => {
    if (curr_user) navigate("/notes");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Update the user's info on input change
  const updateUser = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //Executes when the login button is clicked
  const loginUser = async (e) => {
    setLoading(true);
    //Check if a session is active
    if (curr_user) {
      navigate("/notes");
    } else {
      //Prevent the default action
      e.preventDefault();

      //Make a POST request to /login (backend API) with user's info in the requst body
      const data = await fetch("/api/login", {
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
          message: "Logged in successfully",
          type: "success",
        });

        //Get the user's data and JWT token and store it in the localstorage
        const user_data = await data.json();
        localStorage.setItem("user", JSON.stringify(user_data));

        //Set the Global user state
        setCurrUser(user_data);

        //Navigate to the notes page
        navigate("/notes");
      } else {
        //Get the error message
        const { error } = await data.json();

        //Setting global state for Alert
        setInfo({ open: true, message: error.info, type: "error" });
      }
    }
  };

  return (
    <>
      <div className="container d-flex align-items-center flex-column gap-3 mt-5 justify-content-center mt-2">
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
              {/* <button type="submit" className="btn btn-primary">
                Login
              </button> */}
              <LoadingButton
                size="small"
                loading={loading}
                loadingPosition="end"
                endIcon={<LoginIcon />}
                variant="contained"
                type="submit"
              >
                Login
              </LoadingButton>
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
