import GitHubIcon from "@mui/icons-material/GitHub";
import LoginIcon from "@mui/icons-material/Login";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  //Get hold of the global state
  const { curr_user, setCurrUser, setInfo, loading, setLoading } =
    useContext(UserContext);

  //Create instance of useNavigate()
  const navigate = useNavigate();

  const [authState, setAuthState] = useState(null);

  // eslint-disable-next-line
  const [params, _] = useSearchParams();

  //Create a state for maintaining user info
  const [user, setUser] = useState({ email: "", password: "" });

  //Runs on mount to check if a session is already active
  useEffect(() => {
    if (curr_user) {
      navigate("/notes");
      return;
    }
    setAuthState({
      code: params.get("code"),
      error: params.get("error"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authState?.code) {
      gitHubAuth();
      return;
    }
    if (authState?.error) {
      setInfo({
        open: true,
        message: "Failed to authenticate!",
        type: "warning",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);

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

  const gitHubAuthRedirect = () => {
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
      "_self"
    );
  };

  const gitHubAuth = async () => {
    setLoading(true);
    const data = await fetch("/auth-git", {
      method: "POST",
      body: JSON.stringify({
        code: authState?.code,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);

    // Check if status is success
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
  };

  return (
    <>
      <div className="container d-flex align-items-center flex-column gap-3 mt-3 justify-content-center mt-2">
        <h2>Sign in to view your notes 📒</h2>
        <div className="card text-bg-dark home-card">
          <div className="d-flex gap-3 justify-content-center align-items-center">
            <Button
              color="success"
              onClick={gitHubAuthRedirect}
              variant="contained"
              endIcon={<GitHubIcon />}
              className="text-white"
            >
              Login with GitHub
            </Button>
          </div>
          <hr />
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
