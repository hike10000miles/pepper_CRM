const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    _contactId: {
        type: String,
        required: [true, 'A note must belong to a contact.']
    },
    note: {
        type: String,
        trim: true,
        required: [true, 'A note must has content'],
        minlength: [5, 'This note is too short.'],
        maxlength: [250, 'This not is too long, keep it within 250 characters.']
    }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;