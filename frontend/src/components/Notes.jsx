import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useEffect } from "react";
import Note from "./Note";

const Notes = () => {
  const navigate = useNavigate();

  const { curr_user, setInfo, setCurrUser } = useContext(UserContext);

  useEffect(() => {
    if (!curr_user) navigate("/login");
    else {
      getNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [allNotes, setAllNotes] = useState([]);

  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const updateNote = (e) => {
    setNote((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getNotes = async () => {
    if (curr_user) {
      const data = await fetch("/notes", {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + curr_user.token,
          "Content-Type": "application/json",
        }),
      });

      if (data.ok) {
        setAllNotes(await data.json());
      } else {
        const { error } = await data.json();
        setCurrUser(null);
        localStorage.clear();
        navigate("/login");
        setInfo({ open: true, message: error.info, type: "warning" });
      }
    }
  };

  const saveNote = async (e) => {
    if (curr_user) {
      e.preventDefault();
      const data = await fetch("/notes", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + curr_user.token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(note),
      });
      if (data.ok) {
        setInfo({
          open: true,
          message: "Note saved successfully",
          type: "success",
        });
        note.title = "";
        note.content = "";
        getNotes();
      } else {
        const { error } = await data.json();
        setInfo({ open: true, message: error.info, type: "warning" });
        setCurrUser(null);
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const deleteNote = async (e) => {
    if (curr_user) {
      e.preventDefault();
      const data = await fetch("/delete", {
        method: "post",
        body: JSON.stringify({ id: e.target.value, uid: e.target.name }),
        headers: new Headers({
          Authorization: "Bearer " + curr_user.token,
          "Content-Type": "application/json",
        }),
      });
      if (data.ok) {
        setInfo({
          open: true,
          message: "Deleted note",
          type: "info",
        });
        getNotes();
      } else {
        const { error } = await data.json();
        setInfo({ open: true, message: error.info, type: "warning" });
        setCurrUser(null);
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column align-items-center gap-3 mt-2">
        <div className="card p-3 w-75">
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
          {allNotes.map((note) => (
            <Note key={note._id} note={note} deleteNote={deleteNote} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Notes;
