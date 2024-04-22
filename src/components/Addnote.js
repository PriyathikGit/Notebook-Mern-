import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext'
const Addnote = (props) => {
    const context = useContext(noteContext)
    const { addNote } = context
    const [note, setNote] = useState({ title: "", description: "", tag: "" })

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag)
        setNote({ title: "", description: "", tag: ""})
        props.showAlert("added successfully","success")
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <div className="container my-3">
                <h1 className='my-3'>Add a note here</h1>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name='title' value={note.title} onChange={onChange}  minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type='text' className="form-control" id="description" value={note.description} name='description' onChange={onChange} rows="3"  minLength={5} required></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type='text' className="form-control" id="tag" name='tag' value={note.tag} onChange={onChange} rows="3"  minLength={5} required></input>
                </div>
                <button type="button" disabled={note.title.length<5 || note.description.length<5} className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </div>
        </div>
    )
}

export default Addnote