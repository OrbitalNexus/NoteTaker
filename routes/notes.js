const notes = require('express').Router();
const uuid = require('../helpers/uuid');
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');


notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then(data => res.json(JSON.parse(data)))
});

  // GET Route for a specific note
notes.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// DELETE Route for a specific note
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => {
  // Make a new array of all notes except the one with the ID provided in the URL
  const newData = JSON.parse(data)
  const result = newData.filter((note) => note.id !== noteId);
  
  // Save that array to the filesystem
  writeToFile('./db/db.json', result);

  // Respond to the DELETE request
  res.json(`Note ${noteId} has been deleted 🗑️`);

    });
    
});


// POST Route for a new UX/UI tip
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;