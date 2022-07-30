import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useEffect } from "react";
import Note from "./Note";

const Notes = () => {
  //Create instance of useNavigate()
  const navigate = useNavigate();

  //Get hold of the global state
  const { curr_user, setInfo, setCurrUser } = useContext(UserContext);

  //Runs on mount to check if a session is already active
  useEffect(() => {
    //If not logged in then route to login page
    if (!curr_user) navigate("/login");
    //Else get the notes
    else {
      getNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Create a state for maintaining all the notes of current user
  const [allNotes, setAllNotes] = useState([]);

  //Create a state for maintaining new note's info
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  //Update the note's info on input change
  const updateNote = (e) => {
    setNote((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getNotes = async () => {
    if (curr_user) {
      //Make a GET request to /login (backend API) with JWT token in the header
      const data = await fetch("/api/notes", {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + curr_user.token,
          "Content-Type": "application/json",
        }),
      });

      //Check if status is success
      if (data.ok) {
        //Update the state
        setAllNotes(await data.json());
      } else {
        //Get the error message
        const { error } = await data.json();

        //Clear local storage and Global state for users
        setCurrUser(null);
        localStorage.clear();

        //Route to login pages
        navigate("/login");

        //Setting global state for Alert
        setInfo({ open: true, message: error.info, type: "warning" });
      }
    }
  };

  //Executes when the Save button is clicked
  const saveNote = async (e) => {
    if (curr_user) {
      //Prevent the default action
      e.preventDefault();

      //Make a POST request to /notes (backend API) note info in request body and JWT token in header
      const data = await fetch("/api/notes", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + curr_user.token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(note),
      });

      //Check if status is success
      if (data.ok) {
        //Get details of new note from response
        const new_note = await data.json();

        //Setting global state for Alert
        setInfo({
          open: true,
          message: "Note saved successfully",
          type: "success",
        });

        //Update state for allNotes
        setAllNotes((prev) => [...prev, new_note.note]);

        //Reset note detials
        note.content = "";
        note.title = "";
      } else {
        //Get the error message
        const { error } = await data.json();

        //Setting global state for Alert
        setInfo({ open: true, message: error.info, type: "warning" });

        //Clear local storage and Global state for users
        setCurrUser(null);
        localStorage.clear();

        //Route to the Login page
        navigate("/login");
      }
    }
  };

  //Executes when the delete button is clicked
  const deleteNote = async (e) => {
    if (curr_user) {
      //Prevent the default action
      e.preventDefault();

      //Make a post request to /delete (backend API) with note's info in the requst body and JWT token in the headers
      const data = await fetch("/api/delete", {
        method: "post",
        body: JSON.stringify({ id: e.target.value, uid: e.target.name }),
        headers: new Headers({
          Authorization: "Bearer " + curr_user.token,
          "Content-Type": "application/json",
        }),
      });

      //Check if status is success
      if (data.ok) {
        //Setting global state for Alert
        setInfo({
          open: true,
          message: "Deleted note",
          type: "info",
        });

        //Update the state of allNotes
        setAllNotes((prev) =>
          prev.filter((note) => note._id !== e.target.value)
        );
      } else {
        //Get the error message
        const { error } = await data.json();

        //Setting global state for Alert
        setInfo({ open: true, message: error.info, type: "warning" });

        //Clear local storage and Global state for users
        setCurrUser(null);
        localStorage.clear();

        //Route to the Login page
        navigate("/login");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column align-items-center gap-3 mt-4">
        <div className="card p-3 w-75 test">
          <form onSubmit={saveNote} method="post">
            <div className="mb-3">
              <input
                onChange={updateNote}
                value={note.title}
                type="text"
                className="form-control"
                id="title"
                name="title"
                placeholder="Title"
              />
            </div>
            <div className="mb-3">
              <textarea
                onChange={updateNote}
                value={note.content}
                required
                className="form-control"
                id="content"
                name="content"
                rows="3"
                placeholder="Take a note...."
              ></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
        <div className="container w-100 p-2 d-flex flex-row flex-wrap gap-5 justify-content-evenly">
          {/* Map through all the notes and render the Notes component by passing props */}
          {allNotes.map((note) => (
            <Note
              key={note._id}
              note={note}
              deleteNote={deleteNote}
              refresh={getNotes}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Notes;
