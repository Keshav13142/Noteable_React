import "./App.css";
import Notes from "./components/Notes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { UserContext } from "./contexts/UserContext";
import { useState } from "react";
import { Info } from "./components/Info";

function App() {
  const [curr_user, setCurrUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [info, setInfo] = useState({ open: false, message: "", type: "info" });
  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ curr_user, setCurrUser, info, setInfo }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="notes" element={<Notes />} />
          </Routes>
          <Info />
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
