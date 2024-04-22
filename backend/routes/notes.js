const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');
// Route1: get All the notes using : GET "/api/notes/createuser".no login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server occured")
    }

})
// Route2: Add a new note using : POST "/api/notes/addnote".no login required
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }), // validation
    body('description', 'Description must be 5 characters').isLength({ min: 3 }),
], async (req, res) => {
    // if there are errors return bad request and return errors 
    try {
        const { title, description, tag } = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server occured")
    }
})

// Route 3: Update an existing note using : PUT "/api/notes/updatenote".no login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //Create a new note object
        const newNote = {};
        // updating a title if user requesting and storing it in newNote
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send('not found') }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('not allowed')
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server occured")
    }
})
// Route 4: Update an existing note using : DELETE "/api/notes/deletenote".no login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send('not found') }

        // allow deletion only if the user owns it
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('not allowed')
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "success": "success note has been deleted", note: note })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server occured")
    }
})
module.exports = router