import React, { useState } from 'react'
import noteContext from './noteContext'

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = [];
    const [notes, setNotes] = useState(notesInitial)

    // add a note
    const addNote = async(title, description, tag) => {
        // TODO API CALL
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag}),
        });
        const note = await response.json()
        setNotes(notes.concat(note))
    }

    // GET all notes
    const getNotes = async() => {
        // API CALL
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        // console.log(json);
        setNotes(json);
    }

    // => delete a note
    const deleteNote = async(id) => {
        //  API CALL
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        console.log(json);
        console.log("deleting the item with id:" + id);
        // using filter array funtion to delete the note we saying filter the note in which id is not equal to orginal id and if it is true so delete it
        const newNote = notes.filter((note) => { return note._id !== id })
        setNotes(newNote)
    }

    // edit a note
    const editNote = async (id, tag, description, title) => {
        //API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag}),
        });
        const json = await response.json();
        console.log(json)

        let newNote = JSON.parse(JSON.stringify(notes))
        //logic to edit in client
        for (let index = 0; index < newNote.length; index++) {
            const element = newNote[index];
            if (element._id === id) {
                newNote[index].title = title;
                newNote[index].description = description;
                newNote[index].tag = tag;
                break;
            }
        }
        setNotes(newNote);
    }

    return <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
        {props.children}
    </noteContext.Provider>
}

export default NoteState;