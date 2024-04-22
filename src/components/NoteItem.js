import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext'
const NoteItem = (props) => {
    const { note,updateNote } = props // using props method to access all the element of notes that we sended
    const context = useContext(noteContext)
    const { deleteNote } = context
    return (
        <div className='col-md-3'>
            {/* now we are mapping it */}
            <div className="card my-3">
                {/* <img src="..." className="card-img-top" alt="..."> */}
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="fa-regular fa-trash-can mx-2" onClick={() => { deleteNote(note._id);props.showAlert("deleted successfully","success") }}></i>
                        <i className="fa-regular fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
                    </div>
                    <p className="card-text"> {note.description}</p>
                </div>
            </div>
        </div>
    )
}

export default NoteItem