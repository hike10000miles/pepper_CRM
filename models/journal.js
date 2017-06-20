const mongoose = require('mongoose');

const journalSchema = mongoose.Schema({
    _userId: {
        type: String,
        required: [true, 'A journal must belong to a user.']
    },
    entry: {
        type: String,
        trim: true,
        required: [true, 'A journal must has entry.'],
        minlength: [5, 'This entry is too short.'],
        maxlength: [500, 'This entry is too long, keep it within 250 characters.']
    },
    title: {
        type: String,
        trim: true,
        required: false,
        minlength: [2, 'This title is too short.'],
        maxlength: [15, 'This title is too long']
    }
});

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;