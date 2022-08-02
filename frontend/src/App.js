import "./App.css";
import Notes from "./components/Notes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { UserContext } from "./contexts/UserContext";
import { useState } from "react";
import { Info } from "./components/Info";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Backdrop from "@mui/material/Backdrop";
import LinearProgress from "@mui/material/LinearProgress";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  //Create a state for maintaing the details of the logged in user (name,id and JWT token)
  const [curr_user, setCurrUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [loading, setLoading] = useState(false);

  //Create a state for the alert Info componenet(Alerts)
  const [info, setInfo] = useState({ open: false, message: "", type: "info" });
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          {/* Wrap all the components/routes with the Context provider , set the value of the global state*/}
          <UserContext.Provider
            value={{
              curr_user,
              setCurrUser,
              info,
              setInfo,
              loading,
              setLoading,
            }}
          >
            {loading && <LinearProgress color="primary" />}
            <Navbar />
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            />
            <Routes>
              {/*Declare all the routes and their corresponding  Components*/}
              <Route path="/" element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="notes" element={<Notes />} />
              <Route path="about" element={<About />} />
            </Routes>
            <Info />
          </UserContext.Provider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
