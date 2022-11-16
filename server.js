//CONSTS for requiring packages
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const allNotes = require('./db/db.json');
//---------------------------------------//



//uses json file and makes static file to public
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
//---------------------------------------//



//Gets for routes
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//---------------------------------------//





//Creates new note
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    if (notesArray.length === 0)
        notesArray.push(0);
    body.id = notesArray[0];
    notesArray[0]++;
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}
//---------------------------------------//


//posts new note when creates
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});
//---------------------------------------//


//deletes note
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];
        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
     }
}
//---------------------------------------//



//makes server live
app.listen(PORT, () => {
    console.log(`API server now on port localhost:${PORT}!`);
});