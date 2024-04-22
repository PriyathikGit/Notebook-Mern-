import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext'
import NoteItem from './NoteItem'
import Addnote from './Addnote'
import { useNavigate } from 'react-router-dom'
export const Notes = (props) => {
    let navigate = useNavigate();
    const context = useContext(noteContext)
    const { notes, getNotes, editNote } = context;
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        }
        else (
            navigate("/login")
        )
        // eslint-disable-next-line
    }, [])

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
    }

    const handleClick = (e) => {
        refClose.current.click()
        editNote(note.id, note.etitle, note.edescription, note.etag);
        props.showAlert("updated successfully", "success")
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    const refClose = useRef(null);
    const ref = useRef(null);
    return (
        <>
            <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal" ref={ref}>
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit note</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container my-3">
                                <h1 className='my-3'>Add a note here</h1>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" value={note.etitle} name='etitle' onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type='text' className="form-control" id="edescription" value={note.edescription} name='edescription' onChange={onChange} rows="3" minLength={5} required></input>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type='text' className="form-control" id="etag" name='etag' value={note.etag} onChange={onChange} rows="3"></input>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refClose}>Close</button>
                            <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <Addnote showAlert={props.showAlert} />
            <div className="row my-3">
                <h1>Your note here</h1>
                <div className="container mx-2">
                    {notes.length === 0 && 'no notes to display'}
                </div>
                {notes.map((note) => {  // mapping the note by using map function of array
                    // now we are sending all element of notes as an props and we will use it in different component as NoteItem 
                    return <NoteItem note={note} updateNote={updateNote} showAlert={props.showAlert} key={note._id} />
                })}
            </div>
        </>
    )
}
